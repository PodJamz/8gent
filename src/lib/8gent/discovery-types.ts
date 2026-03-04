/**
 * Discovery Call Types
 *
 * Type definitions for the discovery call agent system.
 * Used by transcript processing and artifact generation.
 *
 * @see GitHub Issue #749, #750
 */

// import { Id } from '../../../convex/_generated/dataModel';
import { Id } from '../convex-shim';

/**
 * Insights extracted from a discovery call transcript
 */
export interface DiscoveryInsights {
  // ─── Core Problem ─────────────────────────────────────────
  problemStatement: string;
  problemSeverity: 'critical' | 'significant' | 'moderate' | 'nice-to-have';
  rootCause?: string;

  // ─── Target Users ─────────────────────────────────────────
  targetUsers: Array<{
    persona: string;
    description: string;
    needs: string[];
    painPoints: string[];
    currentSolution?: string;
  }>;

  // ─── Desired Outcomes ─────────────────────────────────────
  desiredOutcomes: Array<{
    outcome: string;
    metric?: string;
    priority: 'must' | 'should' | 'could';
  }>;

  // ─── Features ─────────────────────────────────────────────
  requestedFeatures: Array<{
    name: string;
    description: string;
    priority: 'must' | 'should' | 'could' | 'wont';
    userStory?: string;
    acceptanceCriteria?: string[];
  }>;

  // ─── Constraints ─────────────────────────────────────────
  constraints: {
    timeline?: string;
    budget?: string;
    techStack?: string[];
    integrations?: string[];
    compliance?: string[];
    teamSize?: string;
    existingSystems?: string[];
  };

  // ─── Stakeholders ─────────────────────────────────────────
  stakeholders: Array<{
    role: string;
    interest: string;
    influence: 'high' | 'medium' | 'low';
  }>;

  // ─── Risks & Unknowns ─────────────────────────────────────
  risksAndUnknowns: Array<{
    item: string;
    severity: 'high' | 'medium' | 'low';
    mitigation?: string;
  }>;

  // ─── Client Quotes ────────────────────────────────────────
  // Verbatim quotes that capture key insights (for PRD authenticity)
  clientQuotes: Array<{
    quote: string;
    context: string;
    relevance: 'problem' | 'user' | 'solution' | 'constraint';
  }>;

  // ─── Metadata ─────────────────────────────────────────────
  projectName?: string;
  callDuration: number; // seconds
  confidenceScore: number; // 0-1, how complete was the discovery?
  suggestedFollowUps: string[];
}

/**
 * Transcript entry from a discovery call
 */
export interface TranscriptEntry {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

/**
 * Discovery call session stored in Convex
 */
export interface DiscoveryCallSession {
  _id: Id<'discoveryCallSessions'>;
  _creationTime: number;

  // Identifiers
  callerId: string;
  phoneNumber?: string;
  clientName?: string;
  clientEmail?: string;

  // Call State
  phase: 'opening' | 'exploration' | 'closing' | 'completed';
  status: 'active' | 'completed' | 'interrupted' | 'processing' | 'done' | 'error';
  topicsCovered: string[];

  // Transcript
  transcript: TranscriptEntry[];

  // Timing
  startedAt: number;
  completedAt?: number;
  duration?: number;

  // Processing Results
  insights?: DiscoveryInsights;
  error?: string;

  // Generated Artifacts
  generatedArtifacts?: {
    projectId?: Id<'productProjects'>;
    prdId?: Id<'prds'>;
    epicIds?: Id<'epics'>[];
    ticketIds?: Id<'tickets'>[];
  };

  // Notification
  notificationSentAt?: number;
}

/**
 * Result of artifact generation
 */
export interface GeneratedArtifacts {
  projectId: Id<'productProjects'>;
  prdId: Id<'prds'>;
  epicIds: Id<'epics'>[];
  ticketIds: Id<'tickets'>[];
}

/**
 * Email notification context
 */
export interface DiscoveryNotificationContext {
  clientName: string;
  clientEmail: string;
  projectName: string;
  problemSummary: string;
  usersSummary: string;
  featuresSummary: string;
  prdLink: string;
  callDuration: string;
}
