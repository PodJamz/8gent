/**
 * Discovery Call Orchestrator
 *
 * Coordinates the end-to-end discovery call pipeline:
 * 1. Call ends → Transcript received
 * 2. Transcript processed → Insights extracted
 * 3. Insights → BMAD artifacts generated
 * 4. Notification sent to client
 *
 * @see GitHub Issue #751
 * @see docs/planning/discovery-call-agent-architecture.md
 */

// import { ConvexHttpClient } from 'convex/browser';
// import { api } from '@/lib/convex-shim';
// import type { Id } from '../../../convex/_generated/dataModel';
import { ConvexHttpClient, api, Id } from '../convex-shim';
import type {
  DiscoveryInsights,
  TranscriptEntry,
  GeneratedArtifacts,
  DiscoveryNotificationContext,
} from './discovery-types';
import { processTranscript, calculateDiscoveryQuality, generateInsightsSummary } from './transcript-processor';
import { generateArtifacts, generateArtifactsSummary } from './artifact-generator';

/**
 * Configuration for the discovery orchestrator
 */
export interface DiscoveryOrchestratorConfig {
  convexUrl: string;
  ownerId: string;
  baseUrl: string; // Base URL for PRD links (e.g., https://openclaw.io)
  resendApiKey?: string; // For email notifications
}

/**
 * Result of processing a completed discovery call
 */
export interface DiscoveryProcessingResult {
  success: boolean;
  sessionId: Id<'discoveryCallSessions'>;
  insights?: DiscoveryInsights;
  artifacts?: GeneratedArtifacts;
  qualityScore?: number;
  error?: string;
}

/**
 * Process a completed discovery call
 *
 * This is the main entry point called when a call ends.
 * It orchestrates the full pipeline from transcript to notification.
 *
 * @param sessionId - The discovery call session ID
 * @param config - Orchestrator configuration
 * @returns Processing result with generated artifacts
 */
export async function processCompletedCall(
  sessionId: Id<'discoveryCallSessions'>,
  config: DiscoveryOrchestratorConfig
): Promise<DiscoveryProcessingResult> {
  const client = new ConvexHttpClient(config.convexUrl);

  try {
    // 1. Fetch the session
    const session = await client.query(api.discovery.getSession, { sessionId });
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    console.log(`[DiscoveryOrchestrator] Processing session ${sessionId}`);
    console.log(`[DiscoveryOrchestrator] Transcript length: ${session.transcript.length} entries`);
    console.log(`[DiscoveryOrchestrator] Duration: ${session.duration || 0} seconds`);

    // 2. Process transcript to extract insights
    console.log('[DiscoveryOrchestrator] Starting transcript processing...');
    const insights = await processTranscript(
      session.transcript as TranscriptEntry[],
      session.duration || 0
    );

    // 3. Calculate quality score
    const quality = calculateDiscoveryQuality(insights);
    console.log(`[DiscoveryOrchestrator] Quality score: ${quality.score}/100`);

    if (quality.recommendations.length > 0) {
      console.log('[DiscoveryOrchestrator] Recommendations:', quality.recommendations);
    }

    // 4. Store insights in session
    await client.mutation(api.discovery.storeInsights, {
      sessionId,
      insights: JSON.stringify(insights),
    });

    // 5. Generate BMAD artifacts
    console.log('[DiscoveryOrchestrator] Generating BMAD artifacts...');
    const artifacts = await generateArtifacts(insights, {
      convexUrl: config.convexUrl,
      ownerId: config.ownerId,
    });

    console.log(`[DiscoveryOrchestrator] Created:`);
    console.log(`  - 1 ProductProject`);
    console.log(`  - 1 PRD`);
    console.log(`  - ${artifacts.epicIds.length} Epics`);
    console.log(`  - ${artifacts.ticketIds.length} Tickets`);

    // 6. Store artifact references in session
    await client.mutation(api.discovery.storeArtifacts, {
      sessionId,
      artifacts: {
        projectId: artifacts.projectId,
        prdId: artifacts.prdId,
        epicIds: artifacts.epicIds,
        ticketIds: artifacts.ticketIds,
      },
    });

    // 7. Send notification if client email is available
    if (session.clientEmail && config.resendApiKey) {
      console.log('[DiscoveryOrchestrator] Sending notification email...');
      await sendNotificationEmail(
        session,
        insights,
        artifacts,
        config
      );

      await client.mutation(api.discovery.markNotificationSent, { sessionId });
    } else {
      console.log('[DiscoveryOrchestrator] Skipping email (no client email or Resend key)');
    }

    // 8. Log summary
    const summary = generateArtifactsSummary(insights, artifacts);
    console.log('[DiscoveryOrchestrator] Processing complete!');
    console.log(summary);

    return {
      success: true,
      sessionId,
      insights,
      artifacts,
      qualityScore: quality.score,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[DiscoveryOrchestrator] Processing failed:', errorMessage);

    // Mark session as error
    await client.mutation(api.discovery.markError, {
      sessionId,
      error: errorMessage,
    });

    return {
      success: false,
      sessionId,
      error: errorMessage,
    };
  }
}

/**
 * Send notification email to the client
 */
async function sendNotificationEmail(
  session: {
    clientName?: string;
    clientEmail?: string;
    duration?: number;
  },
  insights: DiscoveryInsights,
  artifacts: GeneratedArtifacts,
  config: DiscoveryOrchestratorConfig
): Promise<void> {
  if (!session.clientEmail) {
    throw new Error('No client email available');
  }

  if (!config.resendApiKey) {
    throw new Error('Resend API key not configured');
  }

  const context: DiscoveryNotificationContext = {
    clientName: session.clientName || 'there',
    clientEmail: session.clientEmail,
    projectName: insights.projectName || 'Your Project',
    problemSummary: insights.problemStatement.slice(0, 200) + '...',
    usersSummary: insights.targetUsers.map((u) => u.persona).join(', '),
    featuresSummary: insights.requestedFeatures
      .filter((f) => f.priority === 'must')
      .map((f) => f.name)
      .join(', '),
    prdLink: `${config.baseUrl}/projects/${artifacts.projectId}/prd/${artifacts.prdId}`,
    callDuration: formatDuration(session.duration || 0),
  };

  const emailHtml = generateEmailHtml(context);

  // Send via Resend
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'James <james@openclaw.io>',
      to: session.clientEmail,
      subject: `Your Project Brief is Ready - ${context.projectName}`,
      html: emailHtml,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send email: ${errorText}`);
  }

  console.log(`[DiscoveryOrchestrator] Email sent to ${session.clientEmail}`);
}

/**
 * Generate HTML email content
 */
function generateEmailHtml(context: DiscoveryNotificationContext): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Project Brief is Ready</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 32px 40px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                Hey ${context.clientName}! 👋
              </h1>
              <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">
                Your project brief from our call is ready.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Thanks for taking the time to chat with me. I've put together a comprehensive brief based on our ${context.callDuration} conversation.
              </p>

              <!-- Summary Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 18px; font-weight: 600;">
                      ${context.projectName}
                    </h2>

                    <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 14px; line-height: 1.5;">
                      <strong>The Problem:</strong> ${context.problemSummary}
                    </p>

                    <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 14px; line-height: 1.5;">
                      <strong>Target Users:</strong> ${context.usersSummary}
                    </p>

                    <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.5;">
                      <strong>Key Features:</strong> ${context.featuresSummary}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 16px 0;">
                    <a href="${context.prdLink}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; padding: 14px 32px; border-radius: 8px;">
                      View Full Brief →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                The brief includes detailed user personas, prioritized features, and acceptance criteria. If anything looks off or you want to dig deeper into any area, just reply to this email.
              </p>

              <p style="margin: 24px 0 0 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Talk soon,<br>
                <strong>James</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 40px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                This brief was generated from our discovery call using AI-assisted analysis.
                <br>
                OpenClaw-OS • Creative Technologist • San Francisco
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Format duration in human-readable format
 */
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 1) return 'brief';
  if (minutes === 1) return '1 minute';
  return `${minutes} minute`;
}

/**
 * Webhook handler for when a discovery call ends
 * This would be called by deepclaw when the Twilio call disconnects
 */
export async function handleCallEndWebhook(
  callerId: string,
  transcript: TranscriptEntry[],
  duration: number,
  config: DiscoveryOrchestratorConfig
): Promise<DiscoveryProcessingResult> {
  const client = new ConvexHttpClient(config.convexUrl);

  // Find the active session for this caller
  const session = await client.query(api.discovery.getSessionByCallerId, { callerId });
  if (!session) {
    throw new Error(`No active session found for caller ${callerId}`);
  }

  // Update the session with the full transcript and duration
  await client.mutation(api.discovery.updateTranscript, {
    sessionId: session._id,
    transcript,
    duration,
  });

  // Process the completed call
  return processCompletedCall(session._id, config);
}

export default processCompletedCall;
