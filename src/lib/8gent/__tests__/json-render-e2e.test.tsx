/**
 * End-to-End Integration Tests for json-render
 *
 * Tests the complete flow from AI generating a tool call to rendering the UI.
 * This simulates real AI-generated payloads to ensure the system works end-to-end.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { executeTool } from '@/lib/8gent/tool-executor';
import { parseUITree, ClawAIJsonRenderProvider, ClawAIUIRenderer } from '@/lib/8gent/json-render-provider';
import { ToolExecution } from '@/components/claw-ai/ToolExecution';

// Wrapper for rendering with provider
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <ClawAIJsonRenderProvider>{children}</ClawAIJsonRenderProvider>;
}

// Helper to execute render_ui tool
async function executeRenderUI(args: Record<string, unknown>) {
  return executeTool({ name: 'render_ui', arguments: args });
}

// ============================================================================
// SIMULATED AI PAYLOADS
// These represent what 8gent would actually generate
// ============================================================================

const AI_GENERATED_PAYLOADS = {
  // When user asks "Show me my skills"
  skillsDisplay: {
    ui_tree: {
      root: 'container',
      elements: {
        container: {
          type: 'stack',
          props: { direction: 'vertical', gap: 'lg' },
          children: ['heading', 'skills-grid'],
        },
        heading: {
          type: 'heading',
          props: { content: 'Technical Skills', level: 'h2' },
        },
        'skills-grid': {
          type: 'grid',
          props: { columns: 3, gap: 'sm' },
          children: ['skill-react', 'skill-ts', 'skill-node', 'skill-python', 'skill-aws', 'skill-docker'],
        },
        'skill-react': {
          type: 'skillBadge',
          props: { name: 'React', level: 'expert', icon: 'code' },
        },
        'skill-ts': {
          type: 'skillBadge',
          props: { name: 'TypeScript', level: 'expert', icon: 'file-code' },
        },
        'skill-node': {
          type: 'skillBadge',
          props: { name: 'Node.js', level: 'advanced', icon: 'server' },
        },
        'skill-python': {
          type: 'skillBadge',
          props: { name: 'Python', level: 'advanced', icon: 'code' },
        },
        'skill-aws': {
          type: 'skillBadge',
          props: { name: 'AWS', level: 'intermediate', icon: 'cloud' },
        },
        'skill-docker': {
          type: 'skillBadge',
          props: { name: 'Docker', level: 'intermediate', icon: 'container' },
        },
      },
    },
    title: 'My Technical Skills',
  },

  // When user asks "What's the project status?"
  projectStatus: {
    ui_tree: {
      root: 'dashboard',
      elements: {
        dashboard: {
          type: 'stack',
          props: { direction: 'vertical', gap: 'md' },
          children: ['header', 'stats-row', 'progress-section'],
        },
        header: {
          type: 'heading',
          props: { content: 'Project Dashboard', level: 'h2' },
        },
        'stats-row': {
          type: 'grid',
          props: { columns: 3, gap: 'md' },
          children: ['stat-tasks', 'stat-completed', 'stat-time'],
        },
        'stat-tasks': {
          type: 'statCard',
          props: { label: 'Total Tasks', value: 24, icon: 'list' },
        },
        'stat-completed': {
          type: 'statCard',
          props: { label: 'Completed', value: 18, trend: 'up', change: 12, icon: 'check' },
        },
        'stat-time': {
          type: 'statCard',
          props: { label: 'Days Left', value: 5, trend: 'down', change: 2 },
        },
        'progress-section': {
          type: 'card',
          props: { title: 'Overall Progress' },
          children: ['progress-bar', 'status-badge'],
        },
        'progress-bar': {
          type: 'progress',
          props: { value: 75, label: 'Sprint Progress', showValue: true, variant: 'success' },
        },
        'status-badge': {
          type: 'badge',
          props: { label: 'On Track', variant: 'success' },
        },
      },
    },
    title: 'Sprint Status',
  },

  // When user asks "Show me the timeline"
  projectTimeline: {
    ui_tree: {
      root: 'timeline-container',
      elements: {
        'timeline-container': {
          type: 'card',
          props: { title: 'Project Timeline' },
          children: ['timeline'],
        },
        timeline: {
          type: 'timeline',
          props: { variant: 'default' },
          children: ['phase-1', 'phase-2', 'phase-3', 'phase-4'],
        },
        'phase-1': {
          type: 'timelineItem',
          props: {
            title: 'Research & Planning',
            description: 'Market research and technical planning completed',
            date: 'Week 1-2',
            status: 'completed',
            icon: 'search',
          },
        },
        'phase-2': {
          type: 'timelineItem',
          props: {
            title: 'Design Phase',
            description: 'UI/UX design and prototyping',
            date: 'Week 3-4',
            status: 'completed',
            icon: 'palette',
          },
        },
        'phase-3': {
          type: 'timelineItem',
          props: {
            title: 'Development',
            description: 'Core feature implementation in progress',
            date: 'Week 5-8',
            status: 'current',
            icon: 'code',
          },
        },
        'phase-4': {
          type: 'timelineItem',
          props: {
            title: 'Testing & Launch',
            description: 'QA testing and production deployment',
            date: 'Week 9-10',
            status: 'upcoming',
            icon: 'rocket',
          },
        },
      },
    },
  },

  // When user asks "Compare the metrics"
  metricsComparison: {
    ui_tree: {
      root: 'comparison',
      elements: {
        comparison: {
          type: 'stack',
          props: { direction: 'vertical', gap: 'lg' },
          children: ['title', 'chart', 'legend'],
        },
        title: {
          type: 'heading',
          props: { content: 'Monthly Performance', level: 'h3' },
        },
        chart: {
          type: 'barChart',
          props: {
            title: 'Revenue by Quarter',
            data: [
              { label: 'Q1', value: 45000, color: '#3b82f6' },
              { label: 'Q2', value: 52000, color: '#10b981' },
              { label: 'Q3', value: 48000, color: '#f59e0b' },
              { label: 'Q4', value: 61000, color: '#8b5cf6' },
            ],
            showValues: true,
          },
        },
        legend: {
          type: 'text',
          props: { content: 'Revenue growth: +35% YoY', variant: 'caption' },
        },
      },
    },
    title: 'Performance Metrics',
  },

  // Error case: invalid structure
  invalidTree: {
    ui_tree: {
      // Missing root
      elements: {
        text: { type: 'text', props: { content: 'Hello' } },
      },
    },
  },
};

// ============================================================================
// TOOL EXECUTOR TESTS
// ============================================================================

describe('Tool Executor - render_ui', () => {
  it('should successfully execute render_ui with skills display', async () => {
    const result = await executeRenderUI( AI_GENERATED_PAYLOADS.skillsDisplay);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.ui_tree).toBeDefined();
    expect(result.action?.type).toBe('render_ui');
  });

  it('should successfully execute render_ui with project status', async () => {
    const result = await executeRenderUI( AI_GENERATED_PAYLOADS.projectStatus);

    expect(result.success).toBe(true);
    expect(result.data?.title).toBe('Sprint Status');
  });

  it('should successfully execute render_ui with timeline', async () => {
    const result = await executeRenderUI( AI_GENERATED_PAYLOADS.projectTimeline);

    expect(result.success).toBe(true);
  });

  it('should successfully execute render_ui with metrics', async () => {
    const result = await executeRenderUI( AI_GENERATED_PAYLOADS.metricsComparison);

    expect(result.success).toBe(true);
  });

  it('should fail with invalid tree structure', async () => {
    const result = await executeRenderUI( AI_GENERATED_PAYLOADS.invalidTree);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid UI tree structure');
  });

  it('should fail without ui_tree', async () => {
    const result = await executeRenderUI( { title: 'No tree' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('UI tree is required');
  });
});

// ============================================================================
// PARSE AND RENDER TESTS
// ============================================================================

describe('Parse and Render E2E', () => {
  it('should parse and render skills display from AI payload', async () => {
    const result = await executeRenderUI( AI_GENERATED_PAYLOADS.skillsDisplay);
    const tree = parseUITree(result.data?.ui_tree);

    expect(tree).not.toBeNull();

    render(
      <TestWrapper>
        <ClawAIUIRenderer tree={tree} />
      </TestWrapper>
    );

    expect(screen.getByText('Technical Skills')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('should parse and render project status from AI payload', async () => {
    const result = await executeRenderUI( AI_GENERATED_PAYLOADS.projectStatus);
    const tree = parseUITree(result.data?.ui_tree);

    expect(tree).not.toBeNull();

    render(
      <TestWrapper>
        <ClawAIUIRenderer tree={tree} />
      </TestWrapper>
    );

    expect(screen.getByText('Project Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('24')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('On Track')).toBeInTheDocument();
  });

  it('should parse and render timeline from AI payload', async () => {
    const result = await executeRenderUI( AI_GENERATED_PAYLOADS.projectTimeline);
    const tree = parseUITree(result.data?.ui_tree);

    expect(tree).not.toBeNull();

    render(
      <TestWrapper>
        <ClawAIUIRenderer tree={tree} />
      </TestWrapper>
    );

    expect(screen.getByText('Project Timeline')).toBeInTheDocument();
    expect(screen.getByText('Research & Planning')).toBeInTheDocument();
    expect(screen.getByText('Design Phase')).toBeInTheDocument();
    expect(screen.getByText('Development')).toBeInTheDocument();
    expect(screen.getByText('Testing & Launch')).toBeInTheDocument();
  });

  it('should parse and render metrics chart from AI payload', async () => {
    const result = await executeRenderUI( AI_GENERATED_PAYLOADS.metricsComparison);
    const tree = parseUITree(result.data?.ui_tree);

    expect(tree).not.toBeNull();

    render(
      <TestWrapper>
        <ClawAIUIRenderer tree={tree} />
      </TestWrapper>
    );

    expect(screen.getByText('Monthly Performance')).toBeInTheDocument();
    expect(screen.getByText('Revenue by Quarter')).toBeInTheDocument();
    expect(screen.getByText('Q1')).toBeInTheDocument();
    expect(screen.getByText('Q4')).toBeInTheDocument();
  });
});

// ============================================================================
// FULL TOOL EXECUTION COMPONENT TESTS
// ============================================================================

describe('ToolExecution Component E2E', () => {
  it('should render complete skills display through ToolExecution', async () => {
    const result = await executeRenderUI( AI_GENERATED_PAYLOADS.skillsDisplay);

    render(
      <TestWrapper>
        <ToolExecution
          toolName="render_ui"
          status="complete"
          result={result}
        />
      </TestWrapper>
    );

    expect(screen.getByText('My Technical Skills')).toBeInTheDocument();
    expect(screen.getByText('Technical Skills')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('should render complete project status through ToolExecution', async () => {
    const result = await executeRenderUI( AI_GENERATED_PAYLOADS.projectStatus);

    render(
      <TestWrapper>
        <ToolExecution
          toolName="render_ui"
          status="complete"
          result={result}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Sprint Status')).toBeInTheDocument();
    expect(screen.getByText('Project Dashboard')).toBeInTheDocument();
  });

  it('should handle error result gracefully', async () => {
    const result = await executeRenderUI( AI_GENERATED_PAYLOADS.invalidTree);

    render(
      <TestWrapper>
        <ToolExecution
          toolName="render_ui"
          status="error"
          result={result}
        />
      </TestWrapper>
    );

    expect(screen.getByText(/Invalid UI tree structure/)).toBeInTheDocument();
  });
});

// ============================================================================
// REALISTIC CONVERSATION FLOW TESTS
// ============================================================================

describe('Realistic Conversation Flows', () => {
  it('should handle "show me your skills" conversation', async () => {
    // Simulate: User asks "What are your technical skills?"
    // AI calls render_ui with skills display
    const toolResult = await executeRenderUI( AI_GENERATED_PAYLOADS.skillsDisplay);

    // Verify tool execution succeeds
    expect(toolResult.success).toBe(true);

    // Verify UI renders correctly
    render(
      <TestWrapper>
        <ToolExecution
          toolName="render_ui"
          status="complete"
          result={toolResult}
        />
      </TestWrapper>
    );

    // User should see a visual skills display
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getAllByText(/expert/i).length).toBeGreaterThan(0);
  });

  it('should handle "project status" conversation', async () => {
    // Simulate: User asks "What's the project status?"
    // AI calls render_ui with project dashboard
    const toolResult = await executeRenderUI( AI_GENERATED_PAYLOADS.projectStatus);

    expect(toolResult.success).toBe(true);

    render(
      <TestWrapper>
        <ToolExecution
          toolName="render_ui"
          status="complete"
          result={toolResult}
        />
      </TestWrapper>
    );

    // User should see stats and progress
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('24')).toBeInTheDocument();
    expect(screen.getByText('Sprint Progress')).toBeInTheDocument();
  });

  it('should handle "show timeline" conversation', async () => {
    // Simulate: User asks "Show me the project timeline"
    const toolResult = await executeRenderUI( AI_GENERATED_PAYLOADS.projectTimeline);

    expect(toolResult.success).toBe(true);

    render(
      <TestWrapper>
        <ToolExecution
          toolName="render_ui"
          status="complete"
          result={toolResult}
        />
      </TestWrapper>
    );

    // User should see timeline with phases
    expect(screen.getByText('Research & Planning')).toBeInTheDocument();
    expect(screen.getByText('Development')).toBeInTheDocument();
    expect(screen.getByText(/Week 5-8/)).toBeInTheDocument();
  });
});
