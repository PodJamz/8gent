/**
 * Discovery Call Artifact Generator
 *
 * Transforms structured DiscoveryInsights into BMAD artifacts:
 * - ProductProject (container for the initiative)
 * - PRD (Product Requirements Document)
 * - Epics (grouped feature sets)
 * - Tickets (user stories with acceptance criteria)
 *
 * @see GitHub Issue #750
 * @see docs/planning/discovery-call-agent-architecture.md
 */

// import { ConvexHttpClient } from 'convex/browser';
// import { api } from '@/lib/convex-shim';
// import type { Id } from '../../../convex/_generated/dataModel';
import { ConvexHttpClient, api, Id } from '../convex-shim';
import type { DiscoveryInsights, GeneratedArtifacts } from './discovery-types';

/**
 * Configuration for artifact generation
 */
export interface ArtifactGenerationConfig {
  convexUrl: string;
  ownerId: string; // Required for project creation
}

/**
 * Generate all BMAD artifacts from discovery insights
 *
 * @param insights - Structured insights from transcript processing
 * @param config - Generation configuration with Convex URL and owner ID
 * @returns IDs of all generated artifacts
 */
export async function generateArtifacts(
  insights: DiscoveryInsights,
  config: ArtifactGenerationConfig
): Promise<GeneratedArtifacts> {
  const client = new ConvexHttpClient(config.convexUrl);

  // 1. Create the ProductProject
  const projectId = await createProject(client, insights, config.ownerId);

  // 2. Create the PRD
  const prdId = await createPRD(client, projectId, insights);

  // 3. Create Epics (grouped by feature priority/category)
  const epicIds = await createEpics(client, projectId, prdId, insights);

  // 4. Create Tickets (user stories) for each epic
  const ticketIds = await createTickets(client, projectId, epicIds, insights);

  return {
    projectId,
    prdId,
    epicIds,
    ticketIds,
  };
}

/**
 * Create a ProductProject from discovery insights
 */
async function createProject(
  client: ConvexHttpClient,
  insights: DiscoveryInsights,
  ownerId: string
): Promise<Id<'productProjects'>> {
  const projectName = insights.projectName || 'Untitled Discovery Project';

  const result = await client.mutation(api.agentic.createProductProject, {
    name: projectName,
    description: insights.problemStatement,
    ownerId,
  });

  return result.projectId;
}

/**
 * Create a PRD from discovery insights
 */
async function createPRD(
  client: ConvexHttpClient,
  projectId: Id<'productProjects'>,
  insights: DiscoveryInsights
): Promise<Id<'prds'>> {
  // Build structured PRD content from insights
  const executiveSummary = buildExecutiveSummary(insights);
  const problemStatement = buildProblemStatement(insights);

  const result = await client.mutation(api.agentic.createPRD, {
    projectId,
    title: `${insights.projectName || 'Project'} - Product Requirements`,
    executiveSummary,
    problemStatement,
    generatedBy: 'ai',
    aiModel: 'claude-sonnet-4-20250514',
  });

  return result.prdId;
}

/**
 * Create Epics organized by feature category
 */
async function createEpics(
  client: ConvexHttpClient,
  projectId: Id<'productProjects'>,
  prdId: Id<'prds'>,
  insights: DiscoveryInsights
): Promise<Id<'epics'>[]> {
  // Group features into logical epics
  const epicGroups = groupFeaturesIntoEpics(insights);
  const epicIds: Id<'epics'>[] = [];

  for (const group of epicGroups) {
    const result = await client.mutation(api.agentic.createEpic, {
      projectId,
      prdId,
      title: group.title,
      description: group.description,
      goal: group.goal,
      linkedFRs: group.linkedFRs,
    });

    epicIds.push(result.epicId);
  }

  return epicIds;
}

/**
 * Create Tickets (user stories) from features
 */
async function createTickets(
  client: ConvexHttpClient,
  projectId: Id<'productProjects'>,
  epicIds: Id<'epics'>[],
  insights: DiscoveryInsights
): Promise<Id<'tickets'>[]> {
  const ticketIds: Id<'tickets'>[] = [];
  const featureGroups = groupFeaturesIntoEpics(insights);

  for (let i = 0; i < featureGroups.length && i < epicIds.length; i++) {
    const group = featureGroups[i];
    const epicId = epicIds[i];

    for (const feature of group.features) {
      // Find the primary user persona for this feature
      const primaryUser = insights.targetUsers[0]?.persona || 'user';

      // Build user story format
      const userStory = feature.userStory || `be able to ${feature.name.toLowerCase()}`;
      const benefit = findBenefitForFeature(feature, insights);

      // Build acceptance criteria in Given/When/Then format
      const acceptanceCriteria = buildAcceptanceCriteria(feature, insights);

      const result = await client.mutation(api.agentic.createTicket, {
        projectId,
        epicId,
        title: feature.name,
        description: feature.description,
        asA: primaryUser,
        iWant: userStory,
        soThat: benefit,
        acceptanceCriteria,
        type: 'story',
        priority: mapPriorityToP(feature.priority),
        status: 'backlog',
        labels: [feature.priority, 'discovery-generated'],
        storyPoints: estimateStoryPoints(feature),
        createdBy: 'ai',
      });

      ticketIds.push(result._id);
    }
  }

  return ticketIds;
}

// ============================================================================
// Helper Functions
// ============================================================================

function buildExecutiveSummary(insights: DiscoveryInsights): string {
  const userCount = insights.targetUsers.length;
  const featureCount = insights.requestedFeatures.filter((f) => f.priority === 'must').length;

  let summary = `This project addresses ${insights.problemSeverity} pain points for ${userCount} user persona${userCount > 1 ? 's' : ''}.

**Core Problem:** ${insights.problemStatement}

**Key Outcomes:**
${insights.desiredOutcomes.slice(0, 3).map((o) => `- ${o.outcome}`).join('\n')}

**MVP Scope:** ${featureCount} must-have features identified during discovery.

**Confidence:** ${Math.round(insights.confidenceScore * 100)}% based on discovery call coverage.`;

  // Add target users section
  summary += '\n\n---\n\n## Target Users\n\n';
  summary += insights.targetUsers
    .map((user) => {
      let section = `### ${user.persona}\n\n${user.description}\n\n`;
      section += `**Needs:**\n${user.needs.map((n) => `- ${n}`).join('\n')}\n\n`;
      section += `**Pain Points:**\n${user.painPoints.map((p) => `- ${p}`).join('\n')}`;
      if (user.currentSolution) {
        section += `\n\n**Current Solution:** ${user.currentSolution}`;
      }
      return section;
    })
    .join('\n\n---\n\n');

  // Add MVP scope
  const mustHaves = insights.requestedFeatures.filter((f) => f.priority === 'must');
  const shouldHaves = insights.requestedFeatures.filter((f) => f.priority === 'should');

  summary += '\n\n---\n\n## MVP Scope\n\n### Must-Have Features\n\n';
  summary += mustHaves.map((f) => `- **${f.name}**: ${f.description}`).join('\n');

  if (shouldHaves.length > 0) {
    summary += '\n\n### Should-Have Features (Post-MVP)\n\n';
    summary += shouldHaves.map((f) => `- **${f.name}**: ${f.description}`).join('\n');
  }

  // Add constraints
  const c = insights.constraints;
  const constraintLines: string[] = [];
  if (c.timeline) constraintLines.push(`**Timeline:** ${c.timeline}`);
  if (c.budget) constraintLines.push(`**Budget:** ${c.budget}`);
  if (c.teamSize) constraintLines.push(`**Team:** ${c.teamSize}`);
  if (c.techStack?.length) constraintLines.push(`**Technology:** ${c.techStack.join(', ')}`);
  if (c.integrations?.length) constraintLines.push(`**Integrations:** ${c.integrations.join(', ')}`);
  if (c.compliance?.length) constraintLines.push(`**Compliance:** ${c.compliance.join(', ')}`);

  if (constraintLines.length > 0) {
    summary += '\n\n---\n\n## Constraints\n\n';
    summary += constraintLines.join('\n\n');
  }

  // Add risks
  if (insights.risksAndUnknowns.length > 0) {
    summary += '\n\n---\n\n## Risks & Unknowns\n\n';
    summary += insights.risksAndUnknowns
      .map((r) => {
        let text = `- **${r.item}** (${r.severity} severity)`;
        if (r.mitigation) text += `\n  - Mitigation: ${r.mitigation}`;
        return text;
      })
      .join('\n');
  }

  // Add client quotes
  if (insights.clientQuotes.length > 0) {
    summary += '\n\n---\n\n## Client Quotes\n\n';
    summary += insights.clientQuotes
      .map((q) => `> "${q.quote}"\n> — ${q.context}`)
      .join('\n\n');
  }

  // Add follow-ups
  if (insights.suggestedFollowUps.length > 0) {
    summary += '\n\n---\n\n## Suggested Follow-ups\n\n';
    summary += insights.suggestedFollowUps.map((f) => `- ${f}`).join('\n');
  }

  return summary;
}

function buildProblemStatement(insights: DiscoveryInsights): string {
  let statement = insights.problemStatement;

  if (insights.rootCause) {
    statement += `\n\n**Root Cause:** ${insights.rootCause}`;
  }

  // Add supporting client quotes
  const problemQuotes = insights.clientQuotes.filter((q) => q.relevance === 'problem');
  if (problemQuotes.length > 0) {
    statement += '\n\n**In the client\'s words:**\n';
    statement += problemQuotes.slice(0, 2).map((q) => `> "${q.quote}"\n> — ${q.context}`).join('\n\n');
  }

  return statement;
}

interface EpicGroup {
  title: string;
  description: string;
  goal: string;
  linkedFRs: string[];
  features: DiscoveryInsights['requestedFeatures'];
}

function groupFeaturesIntoEpics(insights: DiscoveryInsights): EpicGroup[] {
  const mustHaves = insights.requestedFeatures.filter((f) => f.priority === 'must');
  const shouldHaves = insights.requestedFeatures.filter((f) => f.priority === 'should');
  const couldHaves = insights.requestedFeatures.filter((f) => f.priority === 'could');

  const epics: EpicGroup[] = [];

  // Epic 1: Core MVP
  if (mustHaves.length > 0) {
    epics.push({
      title: 'Core MVP Features',
      description: `Essential features required for initial launch. These address the primary problem: ${insights.problemStatement.slice(0, 100)}...`,
      goal: 'Deliver minimum viable product that solves the core problem',
      linkedFRs: mustHaves.map((f) => `FR-${f.name.replace(/\s+/g, '-').toUpperCase()}`),
      features: mustHaves,
    });
  }

  // Epic 2: Enhanced Experience
  if (shouldHaves.length > 0) {
    epics.push({
      title: 'Enhanced Experience',
      description: 'Features that significantly improve user experience and should be included if timeline permits.',
      goal: 'Elevate the product beyond MVP to provide a polished experience',
      linkedFRs: shouldHaves.map((f) => `FR-${f.name.replace(/\s+/g, '-').toUpperCase()}`),
      features: shouldHaves,
    });
  }

  // Epic 3: Nice-to-Have
  if (couldHaves.length > 0) {
    epics.push({
      title: 'Nice-to-Have Enhancements',
      description: 'Features that would add value but are not critical for launch.',
      goal: 'Add polish and delight to the core experience',
      linkedFRs: couldHaves.map((f) => `FR-${f.name.replace(/\s+/g, '-').toUpperCase()}`),
      features: couldHaves,
    });
  }

  return epics;
}

function findBenefitForFeature(
  feature: DiscoveryInsights['requestedFeatures'][0],
  insights: DiscoveryInsights
): string {
  // Try to find a matching desired outcome
  const matchingOutcome = insights.desiredOutcomes.find(
    (o) => o.outcome.toLowerCase().includes(feature.name.toLowerCase())
  );

  if (matchingOutcome) {
    return matchingOutcome.outcome;
  }

  // Default benefit based on problem statement
  return `address the challenge of ${insights.problemStatement.slice(0, 50).toLowerCase()}...`;
}

function buildAcceptanceCriteria(
  feature: DiscoveryInsights['requestedFeatures'][0],
  insights: DiscoveryInsights
): Array<{ given: string; when: string; then: string }> {
  // If feature has pre-defined acceptance criteria, convert them
  if (feature.acceptanceCriteria && feature.acceptanceCriteria.length > 0) {
    return feature.acceptanceCriteria.map((ac) => ({
      given: `the ${insights.targetUsers[0]?.persona || 'user'} is using the system`,
      when: `they interact with ${feature.name}`,
      then: ac,
    }));
  }

  // Generate basic acceptance criteria
  return [
    {
      given: `a ${insights.targetUsers[0]?.persona || 'user'} is logged in`,
      when: `they access the ${feature.name} feature`,
      then: `they can ${feature.description.toLowerCase()}`,
    },
  ];
}

function mapPriorityToP(priority: 'must' | 'should' | 'could' | 'wont'): 'P0' | 'P1' | 'P2' | 'P3' {
  switch (priority) {
    case 'must':
      return 'P0';
    case 'should':
      return 'P1';
    case 'could':
      return 'P2';
    default:
      return 'P3';
  }
}

function estimateStoryPoints(feature: DiscoveryInsights['requestedFeatures'][0]): number {
  // Basic estimation based on description length and priority
  const descLength = feature.description.length;
  const acCount = feature.acceptanceCriteria?.length || 0;

  if (feature.priority === 'must') {
    // Must-haves tend to be more complex
    return descLength > 100 || acCount > 3 ? 8 : 5;
  } else if (feature.priority === 'should') {
    return descLength > 100 || acCount > 3 ? 5 : 3;
  } else {
    return descLength > 100 ? 3 : 2;
  }
}

/**
 * Generate a summary suitable for quick review
 */
export function generateArtifactsSummary(
  insights: DiscoveryInsights,
  artifacts: GeneratedArtifacts
): string {
  const mustHaveFeatures = insights.requestedFeatures
    .filter((f) => f.priority === 'must')
    .map((f) => f.name)
    .join(', ');

  const topUsers = insights.targetUsers
    .slice(0, 3)
    .map((u) => u.persona)
    .join(', ');

  return `## Generated Artifacts Summary

**Project:** ${insights.projectName || 'Unnamed Project'}
**Call Duration:** ${Math.floor(insights.callDuration / 60)} minutes
**Confidence:** ${Math.round(insights.confidenceScore * 100)}%

### Created
- 1 ProductProject
- 1 PRD
- ${artifacts.epicIds.length} Epics
- ${artifacts.ticketIds.length} Tickets

### Problem
${insights.problemStatement}
**Severity:** ${insights.problemSeverity}

### Target Users
${topUsers}

### Must-Have Features
${mustHaveFeatures || 'None explicitly identified'}

### Next Steps
${insights.suggestedFollowUps.slice(0, 3).map((f) => `- ${f}`).join('\n')}
`;
}

export default generateArtifacts;
