/**
 * User-Defined Cron Jobs Processor
 *
 * Called by Vercel cron every minute to process due user jobs.
 * Supports multiple action types: ai_message, notification, email, webhook
 *
 * Similar to Clawdbot's cron system but integrated with Claw AI.
 */

import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "@/lib/openclaw/client";
import { Resend } from "resend";
import { api } from '@/lib/convex-shim';

// =============================================================================
// Configuration
// =============================================================================

function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL not configured");
  }
  return new ConvexHttpClient(url);
}

function verifyCronRequest(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // In development on localhost, allow all requests
  // SECURITY: Only allow on localhost to prevent accidental production bypass
  if (process.env.NODE_ENV === "development") {
    const host = request.headers.get("host") || "";
    if (host.includes("localhost") || host.includes("127.0.0.1")) {
      return true;
    }
  }

  // SECURITY: Only accept Bearer token authentication
  // The x-vercel-cron header can be spoofed and should not be trusted
  if (authHeader === `Bearer ${cronSecret}`) {
    return true;
  }

  return false;
}

// =============================================================================
// Action Executors
// =============================================================================

interface JobResult {
  status: "success" | "failed" | "skipped";
  error?: string;
  result?: string;
  aiResponse?: string;
  delivered?: boolean;
  deliveryChannel?: string;
  durationMs?: number;
}

/**
 * Execute an AI message action - send prompt to Claw AI and get response
 */
async function executeAIMessage(
  job: {
    userId: string;
    actionPayload: { prompt?: string };
    deliverTo?: { channel?: string; target?: string };
  },
  baseUrl: string
): Promise<JobResult> {
  const prompt = job.actionPayload.prompt;
  if (!prompt) {
    return { status: "failed", error: "No prompt specified" };
  }

  try {
    // Call the Claw AI chat API
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        userId: job.userId,
        source: "cron_job",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { status: "failed", error: `AI API error: ${errorText}` };
    }

    const data = await response.json();
    const aiResponse = data.content || data.message || JSON.stringify(data);

    // Handle delivery if specified
    let delivered = false;
    let deliveryChannel: string | undefined;

    if (job.deliverTo?.channel && job.deliverTo.channel !== "web") {
      // TODO: Implement channel delivery (email, whatsapp, telegram, imessage)
      // For now, just mark as not delivered
      deliveryChannel = job.deliverTo.channel;
      delivered = false;
    }

    return {
      status: "success",
      aiResponse,
      delivered,
      deliveryChannel,
    };
  } catch (error) {
    return {
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Execute an email action
 */
async function executeEmail(
  job: {
    userId: string;
    actionPayload: {
      subject?: string;
      body?: string;
      recipientEmail?: string;
    };
  },
  resend: Resend | null
): Promise<JobResult> {
  if (!resend) {
    return { status: "skipped", error: "Email service not configured" };
  }

  const { subject, body, recipientEmail } = job.actionPayload;

  if (!recipientEmail) {
    return { status: "failed", error: "No recipient email specified" };
  }

  if (!subject || !body) {
    return { status: "failed", error: "Missing subject or body" };
  }

  try {
    const result = await resend.emails.send({
      from: "8gent Automation <noreply@8gent.app>",
      to: [recipientEmail],
      subject,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 20px; border-radius: 12px 12px 0 0; color: white;">
            <h2 style="margin: 0;">${subject}</h2>
            <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">Automated message from 8gent</p>
          </div>
          <div style="background: #f5f3ff; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #c4b5fd; border-top: none;">
            <div style="font-size: 15px; line-height: 1.6;">${body.replace(/\n/g, "<br>")}</div>
          </div>
        </div>
      `,
      text: body,
    });

    return {
      status: "success",
      result: JSON.stringify(result),
      delivered: true,
      deliveryChannel: "email",
    };
  } catch (error) {
    return {
      status: "failed",
      error: error instanceof Error ? error.message : "Email send failed",
    };
  }
}

/**
 * SECURITY: Validate webhook URL to prevent SSRF attacks
 */
function isValidWebhookUrl(url: string): { valid: boolean; error?: string } {
  try {
    const parsed = new URL(url);

    // Only allow HTTPS (no HTTP)
    if (parsed.protocol !== "https:") {
      return { valid: false, error: "Only HTTPS URLs are allowed" };
    }

    // Block localhost and local IPs
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname === "[::1]" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("172.16.") ||
      hostname.startsWith("172.17.") ||
      hostname.startsWith("172.18.") ||
      hostname.startsWith("172.19.") ||
      hostname.startsWith("172.20.") ||
      hostname.startsWith("172.21.") ||
      hostname.startsWith("172.22.") ||
      hostname.startsWith("172.23.") ||
      hostname.startsWith("172.24.") ||
      hostname.startsWith("172.25.") ||
      hostname.startsWith("172.26.") ||
      hostname.startsWith("172.27.") ||
      hostname.startsWith("172.28.") ||
      hostname.startsWith("172.29.") ||
      hostname.startsWith("172.30.") ||
      hostname.startsWith("172.31.") ||
      hostname === "0.0.0.0" ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal")
    ) {
      return { valid: false, error: "Local/internal URLs are not allowed" };
    }

    // Block AWS metadata endpoints
    if (hostname === "169.254.169.254" || hostname.startsWith("169.254.")) {
      return { valid: false, error: "Cloud metadata endpoints are not allowed" };
    }

    // Block common internal services
    const blockedPorts = [22, 23, 25, 3306, 5432, 6379, 27017, 9200];
    if (parsed.port && blockedPorts.includes(parseInt(parsed.port))) {
      return { valid: false, error: "Access to common service ports is not allowed" };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: "Invalid URL format" };
  }
}

/**
 * Execute a webhook action
 */
async function executeWebhook(job: {
  actionPayload: {
    webhookUrl?: string;
    webhookMethod?: "GET" | "POST";
    webhookHeaders?: string;
    webhookBody?: string;
  };
}): Promise<JobResult> {
  const { webhookUrl, webhookMethod, webhookHeaders, webhookBody } =
    job.actionPayload;

  if (!webhookUrl) {
    return { status: "failed", error: "No webhook URL specified" };
  }

  // SECURITY: Validate URL to prevent SSRF
  const urlValidation = isValidWebhookUrl(webhookUrl);
  if (!urlValidation.valid) {
    return { status: "failed", error: urlValidation.error || "Invalid webhook URL" };
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Parse custom headers if provided
    if (webhookHeaders) {
      try {
        const customHeaders = JSON.parse(webhookHeaders);
        Object.assign(headers, customHeaders);
      } catch {
        // Ignore invalid JSON
      }
    }

    const response = await fetch(webhookUrl, {
      method: webhookMethod || "POST",
      headers,
      body: webhookMethod === "GET" ? undefined : webhookBody || "{}",
    });

    const responseText = await response.text();

    if (!response.ok) {
      return {
        status: "failed",
        error: `Webhook returned ${response.status}: ${responseText.slice(0, 200)}`,
      };
    }

    return {
      status: "success",
      result: responseText.slice(0, 1000), // Truncate large responses
    };
  } catch (error) {
    return {
      status: "failed",
      error: error instanceof Error ? error.message : "Webhook call failed",
    };
  }
}

/**
 * Execute a memory snapshot action
 */
async function executeMemorySnapshot(
  job: {
    jobId: string;
    name: string;
    userId: string;
    actionPayload: { memoryContext?: string };
  },
  convex: ConvexHttpClient
): Promise<JobResult> {
  const context = job.actionPayload.memoryContext || "Automated memory snapshot";

  try {
    // Store as an episodic memory
    await convex.mutation(api.memories.storeEpisodic, {
      userId: job.userId,
      content: `[Cron Job Memory Snapshot] ${context} (Job: ${job.name})`,
      memoryType: "milestone",
      importance: 0.5,
      metadata: {
        outcome: `Scheduled snapshot from cron job: ${job.jobId}`,
      },
    });

    return { status: "success", result: "Memory snapshot saved" };
  } catch (error) {
    return {
      status: "failed",
      error: error instanceof Error ? error.message : "Memory save failed",
    };
  }
}

// =============================================================================
// Main Handler
// =============================================================================

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Verify this is a legitimate cron request
    if (!verifyCronRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const convex = getConvexClient();

    // Get due jobs
    const dueJobs = await convex.query(api.userCronJobs.getDueJobs);

    if (dueJobs.length === 0) {
      return NextResponse.json({
        success: true,
        processed: 0,
        message: "No jobs due",
        durationMs: Date.now() - startTime,
      });
    }

    // Initialize services
    const resendApiKey = process.env.RESEND_API_KEY;
    const resend = resendApiKey ? new Resend(resendApiKey) : null;

    // Get base URL for internal API calls
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";

    const results: Array<{
      jobId: string;
      name: string;
      status: string;
      error?: string;
    }> = [];

    // Process each due job
    for (const job of dueJobs) {
      const jobStartTime = Date.now();
      let result: JobResult;

      try {
        switch (job.actionType) {
          case "ai_message":
            result = await executeAIMessage(
              {
                userId: job.userId,
                actionPayload: job.actionPayload,
                deliverTo: job.deliverTo,
              },
              baseUrl
            );
            break;

          case "email":
            result = await executeEmail(
              {
                userId: job.userId,
                actionPayload: job.actionPayload,
              },
              resend
            );
            break;

          case "webhook":
            result = await executeWebhook({
              actionPayload: job.actionPayload,
            });
            break;

          case "memory_snapshot":
            result = await executeMemorySnapshot(
              {
                jobId: job.jobId,
                name: job.name,
                userId: job.userId,
                actionPayload: job.actionPayload,
              },
              convex
            );
            break;

          case "notification":
            // TODO: Implement push notifications
            result = { status: "skipped", error: "Notifications not yet implemented" };
            break;

          default:
            result = { status: "failed", error: `Unknown action type: ${job.actionType}` };
        }
      } catch (error) {
        result = {
          status: "failed",
          error: error instanceof Error ? error.message : "Execution failed",
        };
      }

      // Mark job as executed
      await convex.mutation(api.userCronJobs.markJobExecuted, {
        jobId: job.jobId,
        status: result.status,
        error: result.error,
        result: result.result,
        aiResponse: result.aiResponse,
        durationMs: Date.now() - jobStartTime,
        delivered: result.delivered,
        deliveryChannel: result.deliveryChannel,
      });

      results.push({
        jobId: job.jobId,
        name: job.name,
        status: result.status,
        error: result.error,
      });
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
      durationMs: Date.now() - startTime,
    });
  } catch (error) {
    console.error("Cron job processor error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        durationMs: Date.now() - startTime,
      },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggering
export async function POST(request: NextRequest) {
  return GET(request);
}
