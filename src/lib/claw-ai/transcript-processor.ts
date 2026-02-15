/**
 * Discovery Call Transcript Processor
 *
 * Analyzes discovery call transcripts using Claude to extract
 * structured insights for PRD/Epic/Story generation.
 *
 * @see GitHub Issue #749
 * @see docs/planning/discovery-call-agent-architecture.md
 */

import Anthropic from '@anthropic-ai/sdk';
import type { DiscoveryInsights, TranscriptEntry } from './discovery-types';

const anthropic = new Anthropic();

/**
 * System prompt for transcript analysis
 * Instructs Claude to extract structured insights from discovery call transcripts
 */
const TRANSCRIPT_ANALYSIS_PROMPT = `You are an expert product analyst reviewing a discovery call transcript between James (a creative technologist) and a potential client.

Your task is to extract structured insights from this conversation that will be used to generate:
1. A Product Requirements Document (PRD)
2. Epics for the project backlog
3. User stories with acceptance criteria

## Extraction Guidelines

### Problem Understanding
- Identify the core problem being discussed
- Rate its severity based on how the client describes impact
- Look for root causes mentioned, not just symptoms
- Note any "aha moments" where the real problem emerged

### User Analysis
- Identify distinct user personas mentioned
- Capture their specific needs and pain points
- Note how they currently solve the problem
- Look for Jobs to be Done patterns (what are they trying to accomplish?)

### Feature Discovery
- List all features/capabilities mentioned
- Classify priority using MoSCoW (Must/Should/Could/Won't)
- Extract user stories in "As a [user] I want [capability] so that [benefit]" format
- Note any acceptance criteria mentioned

### Constraints
- Timeline pressures
- Budget indicators
- Technical requirements or preferences
- Integration needs
- Compliance/regulatory requirements

### Stakeholders
- Who else cares about this project?
- Who makes the budget decision?
- Who will be affected by the solution?

### Client Quotes
- Capture verbatim quotes that reveal key insights
- These add authenticity to the PRD
- Tag each quote with what it reveals (problem, user, solution, constraint)

### Confidence Assessment
- Rate your confidence (0-1) based on how complete the discovery was
- Note what follow-up questions would help clarify unknowns
- Suggest areas that need more exploration

## Output Format

Return a JSON object matching the DiscoveryInsights interface exactly. Be thorough but realistic - if something wasn't discussed, don't invent it. Mark fields as undefined if not covered.`;

/**
 * Process a discovery call transcript and extract structured insights
 *
 * @param transcript - Array of transcript entries from the call
 * @param callDuration - Duration of the call in seconds
 * @returns Structured insights for PRD generation
 */
export async function processTranscript(
  transcript: TranscriptEntry[],
  callDuration: number
): Promise<DiscoveryInsights> {
  // Format transcript for analysis
  const formattedTranscript = transcript
    .map((entry) => {
      const speaker = entry.role === 'assistant' ? 'James' : 'Client';
      return `[${speaker}]: ${entry.content}`;
    })
    .join('\n\n');

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    system: TRANSCRIPT_ANALYSIS_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Please analyze this discovery call transcript and extract structured insights.

## Call Information
- Duration: ${Math.floor(callDuration / 60)} minutes ${callDuration % 60} seconds
- Total exchanges: ${transcript.length}

## Transcript

${formattedTranscript}

## Instructions

Extract insights following the guidelines. Return ONLY valid JSON matching this TypeScript interface:

\`\`\`typescript
interface DiscoveryInsights {
  problemStatement: string;
  problemSeverity: 'critical' | 'significant' | 'moderate' | 'nice-to-have';
  rootCause?: string;

  targetUsers: Array<{
    persona: string;
    description: string;
    needs: string[];
    painPoints: string[];
    currentSolution?: string;
  }>;

  desiredOutcomes: Array<{
    outcome: string;
    metric?: string;
    priority: 'must' | 'should' | 'could';
  }>;

  requestedFeatures: Array<{
    name: string;
    description: string;
    priority: 'must' | 'should' | 'could' | 'wont';
    userStory?: string;
    acceptanceCriteria?: string[];
  }>;

  constraints: {
    timeline?: string;
    budget?: string;
    techStack?: string[];
    integrations?: string[];
    compliance?: string[];
    teamSize?: string;
    existingSystems?: string[];
  };

  stakeholders: Array<{
    role: string;
    interest: string;
    influence: 'high' | 'medium' | 'low';
  }>;

  risksAndUnknowns: Array<{
    item: string;
    severity: 'high' | 'medium' | 'low';
    mitigation?: string;
  }>;

  clientQuotes: Array<{
    quote: string;
    context: string;
    relevance: 'problem' | 'user' | 'solution' | 'constraint';
  }>;

  projectName?: string;
  callDuration: number;
  confidenceScore: number;
  suggestedFollowUps: string[];
}
\`\`\`

Return ONLY the JSON object, no markdown code blocks or explanation.`,
      },
    ],
  });

  // Extract JSON from response
  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  let jsonText = content.text.trim();

  // Handle potential markdown code block wrapping
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.slice(7);
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.slice(3);
  }
  if (jsonText.endsWith('```')) {
    jsonText = jsonText.slice(0, -3);
  }
  jsonText = jsonText.trim();

  try {
    const insights = JSON.parse(jsonText) as DiscoveryInsights;

    // Ensure callDuration is set correctly
    insights.callDuration = callDuration;

    // Validate required fields
    validateInsights(insights);

    return insights;
  } catch (error) {
    console.error('[TranscriptProcessor] Failed to parse insights JSON:', error);
    console.error('[TranscriptProcessor] Raw response:', content.text);
    throw new Error(`Failed to parse transcript insights: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate that extracted insights have required fields
 */
function validateInsights(insights: DiscoveryInsights): void {
  if (!insights.problemStatement) {
    throw new Error('Missing required field: problemStatement');
  }

  if (!insights.problemSeverity) {
    throw new Error('Missing required field: problemSeverity');
  }

  if (!Array.isArray(insights.targetUsers) || insights.targetUsers.length === 0) {
    throw new Error('Missing or empty required field: targetUsers');
  }

  if (!Array.isArray(insights.desiredOutcomes)) {
    insights.desiredOutcomes = [];
  }

  if (!Array.isArray(insights.requestedFeatures)) {
    insights.requestedFeatures = [];
  }

  if (!insights.constraints) {
    insights.constraints = {};
  }

  if (!Array.isArray(insights.stakeholders)) {
    insights.stakeholders = [];
  }

  if (!Array.isArray(insights.risksAndUnknowns)) {
    insights.risksAndUnknowns = [];
  }

  if (!Array.isArray(insights.clientQuotes)) {
    insights.clientQuotes = [];
  }

  if (typeof insights.confidenceScore !== 'number') {
    insights.confidenceScore = 0.5;
  }

  if (!Array.isArray(insights.suggestedFollowUps)) {
    insights.suggestedFollowUps = [];
  }
}

/**
 * Calculate a quality score for the discovery call
 * Based on topics covered and depth of conversation
 */
export function calculateDiscoveryQuality(insights: DiscoveryInsights): {
  score: number;
  breakdown: Record<string, number>;
  recommendations: string[];
} {
  const breakdown: Record<string, number> = {};
  const recommendations: string[] = [];

  // Problem clarity (0-20 points)
  breakdown.problem = insights.problemStatement.length > 50 ? 20 : 10;
  if (insights.rootCause) breakdown.problem += 5;
  if (breakdown.problem < 20) {
    recommendations.push('Dig deeper into the root cause of the problem');
  }

  // User understanding (0-20 points)
  breakdown.users = Math.min(insights.targetUsers.length * 10, 20);
  if (breakdown.users < 20) {
    recommendations.push('Identify more distinct user personas');
  }

  // Feature clarity (0-20 points)
  const mustHaves = insights.requestedFeatures.filter((f) => f.priority === 'must').length;
  breakdown.features = Math.min(mustHaves * 5, 20);
  if (breakdown.features < 15) {
    recommendations.push('Clarify must-have features for MVP');
  }

  // Constraints captured (0-15 points)
  const constraintCount = Object.values(insights.constraints).filter(Boolean).length;
  breakdown.constraints = Math.min(constraintCount * 3, 15);
  if (!insights.constraints.timeline) {
    recommendations.push('Establish timeline expectations');
  }

  // Stakeholder mapping (0-10 points)
  breakdown.stakeholders = Math.min(insights.stakeholders.length * 3, 10);
  if (breakdown.stakeholders < 6) {
    recommendations.push('Identify decision makers and influencers');
  }

  // Client quotes captured (0-10 points)
  breakdown.quotes = Math.min(insights.clientQuotes.length * 2, 10);
  if (breakdown.quotes < 6) {
    recommendations.push('Capture more verbatim client quotes for the PRD');
  }

  // Risks identified (0-5 points)
  breakdown.risks = Math.min(insights.risksAndUnknowns.length * 2, 5);

  const score = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

  return {
    score,
    breakdown,
    recommendations: score < 70 ? recommendations : [],
  };
}

/**
 * Generate a summary suitable for quick review
 */
export function generateInsightsSummary(insights: DiscoveryInsights): string {
  const mustHaveFeatures = insights.requestedFeatures
    .filter((f) => f.priority === 'must')
    .map((f) => f.name)
    .join(', ');

  const topUsers = insights.targetUsers
    .slice(0, 3)
    .map((u) => u.persona)
    .join(', ');

  return `## Discovery Call Summary

**Project:** ${insights.projectName || 'Unnamed Project'}
**Duration:** ${Math.floor(insights.callDuration / 60)} minutes
**Confidence:** ${Math.round(insights.confidenceScore * 100)}%

### Problem
${insights.problemStatement}
**Severity:** ${insights.problemSeverity}

### Target Users
${topUsers}

### Must-Have Features
${mustHaveFeatures || 'None explicitly identified'}

### Key Constraints
${insights.constraints.timeline ? `- Timeline: ${insights.constraints.timeline}` : ''}
${insights.constraints.budget ? `- Budget: ${insights.constraints.budget}` : ''}
${insights.constraints.techStack?.length ? `- Tech: ${insights.constraints.techStack.join(', ')}` : ''}

### Follow-up Needed
${insights.suggestedFollowUps.slice(0, 3).map((f) => `- ${f}`).join('\n')}
`;
}

export default processTranscript;
