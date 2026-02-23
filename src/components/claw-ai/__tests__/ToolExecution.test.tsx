/**
 * Integration tests for ToolExecution component
 *
 * Tests the render_ui tool result display with json-render integration
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToolExecution } from '../ToolExecution';
import { ClawAIJsonRenderProvider } from '@/lib/8gent/json-render-provider';

// Wrapper component for json-render context
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <ClawAIJsonRenderProvider>{children}</ClawAIJsonRenderProvider>;
}

// ============================================================================
// TOOL EXECUTION STATUS TESTS
// ============================================================================

describe('ToolExecution status display', () => {
  it('should render pending state', () => {
    render(
      <TestWrapper>
        <ToolExecution toolName="render_ui" status="pending" />
      </TestWrapper>
    );

    expect(screen.getByText('Custom UI')).toBeInTheDocument();
  });

  it('should render executing state with active label', () => {
    render(
      <TestWrapper>
        <ToolExecution toolName="render_ui" status="executing" />
      </TestWrapper>
    );

    expect(screen.getByText('Rendering UI...')).toBeInTheDocument();
  });

  it('should render complete state', () => {
    render(
      <TestWrapper>
        <ToolExecution
          toolName="render_ui"
          status="complete"
          result={{
            success: true,
            data: {
              ui_tree: {
                root: 'text-1',
                elements: {
                  'text-1': {
                    type: 'text',
                    props: { content: 'Rendered content' },
                  },
                },
              },
            },
          }}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Rendered content')).toBeInTheDocument();
  });

  it('should render error state', () => {
    render(
      <TestWrapper>
        <ToolExecution
          toolName="render_ui"
          status="error"
          result={{
            success: false,
            error: 'Failed to render UI',
          }}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Failed to render UI')).toBeInTheDocument();
  });
});

// ============================================================================
// RENDER_UI TOOL RESULT TESTS
// ============================================================================

describe('render_ui tool result display', () => {
  it('should render simple text UI tree', () => {
    render(
      <TestWrapper>
        <ToolExecution
          toolName="render_ui"
          status="complete"
          result={{
            success: true,
            data: {
              title: 'Test UI',
              ui_tree: {
                root: 'text-1',
                elements: {
                  'text-1': {
                    type: 'text',
                    props: { content: 'Hello World' },
                  },
                },
              },
            },
          }}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Test UI')).toBeInTheDocument();
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should render heading UI tree', () => {
    render(
      <TestWrapper>
        <ToolExecution
          toolName="render_ui"
          status="complete"
          result={{
            success: true,
            data: {
              ui_tree: {
                root: 'heading-1',
                elements: {
                  'heading-1': {
                    type: 'heading',
                    props: { content: 'Dashboard Header', level: 'h1' },
                  },
                },
              },
            },
          }}
        />
      </TestWrapper>
    );

    const heading = screen.getByText('Dashboard Header');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('should render card with nested content', () => {
    render(
      <TestWrapper>
        <ToolExecution
          toolName="render_ui"
          status="complete"
          result={{
            success: true,
            data: {
              ui_tree: {
                root: 'card-1',
                elements: {
                  'card-1': {
                    type: 'card',
                    props: { title: 'Info Card', description: 'Some description' },
                    children: ['text-1'],
                  },
                  'text-1': {
                    type: 'text',
                    props: { content: 'Card body content' },
                  },
                },
              },
            },
          }}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Info Card')).toBeInTheDocument();
    expect(screen.getByText('Some description')).toBeInTheDocument();
    expect(screen.getByText('Card body content')).toBeInTheDocument();
  });

  it('should render stat card grid', () => {
    render(
      <TestWrapper>
        <ToolExecution
          toolName="render_ui"
          status="complete"
          result={{
            success: true,
            data: {
              ui_tree: {
                root: 'grid-1',
                elements: {
                  'grid-1': {
                    type: 'grid',
                    props: { columns: 3, gap: 'md' },
                    children: ['stat-1', 'stat-2', 'stat-3'],
                  },
                  'stat-1': {
                    type: 'statCard',
                    props: { label: 'Users', value: 1234, trend: 'up', change: 12 },
                  },
                  'stat-2': {
                    type: 'statCard',
                    props: { label: 'Revenue', value: '$50k', trend: 'up', change: 8 },
                  },
                  'stat-3': {
                    type: 'statCard',
                    props: { label: 'Orders', value: 567, trend: 'down', change: 3 },
                  },
                },
              },
            },
          }}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$50k')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('567')).toBeInTheDocument();
  });

  it('should render complex nested UI tree', () => {
    render(
      <TestWrapper>
        <ToolExecution
          toolName="render_ui"
          status="complete"
          result={{
            success: true,
            data: {
              ui_tree: {
                root: 'stack-1',
                elements: {
                  'stack-1': {
                    type: 'stack',
                    props: { direction: 'vertical', gap: 'lg' },
                    children: ['heading-1', 'card-1'],
                  },
                  'heading-1': {
                    type: 'heading',
                    props: { content: 'Project Overview', level: 'h2' },
                  },
                  'card-1': {
                    type: 'card',
                    props: { title: 'Status' },
                    children: ['progress-1', 'badge-1'],
                  },
                  'progress-1': {
                    type: 'progress',
                    props: { value: 75, label: 'Completion', showValue: true },
                  },
                  'badge-1': {
                    type: 'badge',
                    props: { label: 'On Track', variant: 'success' },
                  },
                },
              },
            },
          }}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Project Overview')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Completion')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('On Track')).toBeInTheDocument();
  });

  it('should show error for invalid UI tree', () => {
    render(
      <TestWrapper>
        <ToolExecution
          toolName="render_ui"
          status="complete"
          result={{
            success: true,
            data: {
              ui_tree: {
                // Invalid - missing root
                elements: {},
              },
            },
          }}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Invalid UI tree structure')).toBeInTheDocument();
  });

  it('should show message when no UI tree provided', () => {
    render(
      <TestWrapper>
        <ToolExecution
          toolName="render_ui"
          status="complete"
          result={{
            success: true,
            data: {},
          }}
        />
      </TestWrapper>
    );

    expect(screen.getByText('No UI to render')).toBeInTheDocument();
  });
});

// ============================================================================
// OTHER TOOL TYPES TESTS
// ============================================================================

describe('Other tool types', () => {
  it('should render search_portfolio results', () => {
    render(
      <TestWrapper>
        <ToolExecution
          toolName="search_portfolio"
          status="complete"
          result={{
            success: true,
            data: {
              results: [
                { type: 'project', title: 'Project 1', description: 'Desc', url: '/project1' },
                { type: 'experience', title: 'Work 1', description: 'Desc', url: '/work1' },
              ],
            },
          }}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Found 2 results')).toBeInTheDocument();
    expect(screen.getByText('Project 1')).toBeInTheDocument();
    expect(screen.getByText('Work 1')).toBeInTheDocument();
  });

  it('should render navigate_to result', () => {
    const onNavigate = vi.fn();
    render(
      <TestWrapper>
        <ToolExecution
          toolName="navigate_to"
          status="complete"
          result={{
            success: true,
            data: {
              url: '/projects',
              message: 'Navigating to projects page',
            },
          }}
          onNavigate={onNavigate}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Navigating to projects page')).toBeInTheDocument();

    const navigateButton = screen.getByText('Go to page');
    fireEvent.click(navigateButton);
    expect(onNavigate).toHaveBeenCalledWith('/projects');
  });

  it('should render schedule_call result', () => {
    render(
      <TestWrapper>
        <ToolExecution
          toolName="schedule_call"
          status="complete"
          result={{
            success: true,
            data: {
              url: 'https://calendly.com/test',
              message: 'Opening calendar',
            },
          }}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Opening calendar')).toBeInTheDocument();
    const calendarLink = screen.getByText('Open Calendar');
    expect(calendarLink.closest('a')).toHaveAttribute('href', 'https://calendly.com/test');
  });

  it('should render list_themes result', () => {
    render(
      <TestWrapper>
        <ToolExecution
          toolName="list_themes"
          status="complete"
          result={{
            success: true,
            data: {
              themes: [
                { name: 'dark', label: 'Dark Mode', url: '/design/dark' },
                { name: 'light', label: 'Light Mode', url: '/design/light' },
              ],
              count: 2,
            },
          }}
        />
      </TestWrapper>
    );

    expect(screen.getByText('2 themes available')).toBeInTheDocument();
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
    expect(screen.getByText('Light Mode')).toBeInTheDocument();
  });

  it('should render show_weather result', () => {
    render(
      <TestWrapper>
        <ToolExecution
          toolName="show_weather"
          status="complete"
          result={{
            success: true,
            data: {
              location: 'San Francisco',
              temperature: 65,
              condition: 'sunny',
              humidity: 50,
              windSpeed: 10,
            },
          }}
        />
      </TestWrapper>
    );

    expect(screen.getByText('San Francisco')).toBeInTheDocument();
    expect(screen.getByText('65')).toBeInTheDocument();
    expect(screen.getByText('°F')).toBeInTheDocument();
  });

  it('should render show_kanban_tasks result', () => {
    render(
      <TestWrapper>
        <ToolExecution
          toolName="show_kanban_tasks"
          status="complete"
          result={{
            success: true,
            data: {
              tasks: [
                { id: '1', title: 'Task 1', status: 'todo', priority: 'high' },
                { id: '2', title: 'Task 2', status: 'in-progress', priority: 'medium' },
              ],
            },
          }}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('should render unknown tool with raw JSON', () => {
    render(
      <TestWrapper>
        <ToolExecution
          toolName="unknown_tool"
          status="complete"
          result={{
            success: true,
            data: {
              customField: 'Custom value',
            },
          }}
        />
      </TestWrapper>
    );

    // Should show raw JSON for unknown tools
    expect(screen.getByText(/"customField": "Custom value"/)).toBeInTheDocument();
  });
});

// ============================================================================
// EDGE CASES
// ============================================================================

describe('Edge cases', () => {
  it('should handle null result data', () => {
    render(
      <TestWrapper>
        <ToolExecution
          toolName="render_ui"
          status="complete"
          result={{
            success: true,
            data: undefined,
          }}
        />
      </TestWrapper>
    );

    // Should not crash
    expect(document.body).toBeInTheDocument();
  });

  it('should handle empty search results', () => {
    render(
      <TestWrapper>
        <ToolExecution
          toolName="search_portfolio"
          status="complete"
          result={{
            success: true,
            data: {
              results: [],
            },
          }}
        />
      </TestWrapper>
    );

    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('should handle empty kanban tasks', () => {
    render(
      <TestWrapper>
        <ToolExecution
          toolName="show_kanban_tasks"
          status="complete"
          result={{
            success: true,
            data: {
              tasks: [],
            },
          }}
        />
      </TestWrapper>
    );

    expect(screen.getByText('No tasks found')).toBeInTheDocument();
  });

  it('should handle deeply nested UI trees', () => {
    render(
      <TestWrapper>
        <ToolExecution
          toolName="render_ui"
          status="complete"
          result={{
            success: true,
            data: {
              ui_tree: {
                root: 'stack-1',
                elements: {
                  'stack-1': {
                    type: 'stack',
                    props: { direction: 'vertical' },
                    children: ['card-1'],
                  },
                  'card-1': {
                    type: 'card',
                    props: { title: 'Level 1' },
                    children: ['card-2'],
                  },
                  'card-2': {
                    type: 'card',
                    props: { title: 'Level 2' },
                    children: ['card-3'],
                  },
                  'card-3': {
                    type: 'card',
                    props: { title: 'Level 3' },
                    children: ['text-1'],
                  },
                  'text-1': {
                    type: 'text',
                    props: { content: 'Deeply nested content' },
                  },
                },
              },
            },
          }}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Level 1')).toBeInTheDocument();
    expect(screen.getByText('Level 2')).toBeInTheDocument();
    expect(screen.getByText('Level 3')).toBeInTheDocument();
    expect(screen.getByText('Deeply nested content')).toBeInTheDocument();
  });
});

// ============================================================================
// ANIMATION AND STYLING TESTS
// ============================================================================

describe('Animation and styling', () => {
  it('should have motion wrapper', () => {
    const { container } = render(
      <TestWrapper>
        <ToolExecution toolName="render_ui" status="pending" />
      </TestWrapper>
    );

    // Motion div should be present
    expect(container.querySelector('[class*="rounded-xl"]')).toBeInTheDocument();
  });

  it('should show loading spinner during executing state', () => {
    const { container } = render(
      <TestWrapper>
        <ToolExecution toolName="render_ui" status="executing" />
      </TestWrapper>
    );

    // Should have animate-spin class for loader
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should show check icon on complete', () => {
    const { container } = render(
      <TestWrapper>
        <ToolExecution
          toolName="render_ui"
          status="complete"
          result={{
            success: true,
            data: {
              ui_tree: {
                root: 'text-1',
                elements: {
                  'text-1': { type: 'text', props: { content: 'Done' } },
                },
              },
            },
          }}
        />
      </TestWrapper>
    );

    // Should have success styling
    expect(container.querySelector('.bg-green-500\\/20')).toBeInTheDocument();
  });
});
