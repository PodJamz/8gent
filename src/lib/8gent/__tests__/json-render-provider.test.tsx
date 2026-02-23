/**
 * Tests for json-render-provider.tsx
 *
 * Tests the parseUITree function and ClawAIUIRenderer component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  ClawAIJsonRenderProvider,
  ClawAIUIRenderer,
  parseUITree,
  type UITree,
} from '../json-render-provider';

// ============================================================================
// parseUITree TESTS
// ============================================================================

describe('parseUITree', () => {
  it('should return null for null input', () => {
    expect(parseUITree(null)).toBeNull();
  });

  it('should return null for undefined input', () => {
    expect(parseUITree(undefined)).toBeNull();
  });

  it('should return null for non-object input', () => {
    expect(parseUITree('string')).toBeNull();
    expect(parseUITree(123)).toBeNull();
    expect(parseUITree(true)).toBeNull();
  });

  it('should return null for empty object', () => {
    expect(parseUITree({})).toBeNull();
  });

  it('should return null for object without root', () => {
    expect(parseUITree({ elements: {} })).toBeNull();
  });

  it('should return null for object without elements', () => {
    expect(parseUITree({ root: 'test' })).toBeNull();
  });

  it('should return null for object with non-object elements', () => {
    expect(parseUITree({ root: 'test', elements: 'invalid' })).toBeNull();
    // Note: Arrays are objects in JS, so { elements: [] } passes the typeof check
    // The implementation accepts any object type for elements
  });

  it('should return valid UITree for correct structure', () => {
    const validTree = {
      root: 'container-1',
      elements: {
        'container-1': {
          type: 'text',
          props: { content: 'Hello World' },
        },
      },
    };

    const result = parseUITree(validTree);
    expect(result).not.toBeNull();
    expect(result?.root).toBe('container-1');
    expect(result?.elements).toHaveProperty('container-1');
  });

  it('should handle complex nested tree structures', () => {
    const complexTree = {
      root: 'stack-1',
      elements: {
        'stack-1': {
          type: 'stack',
          props: { direction: 'vertical', gap: 'md' },
          children: ['heading-1', 'card-1'],
        },
        'heading-1': {
          type: 'heading',
          props: { content: 'Dashboard', level: 'h1' },
        },
        'card-1': {
          type: 'card',
          props: { title: 'Stats' },
          children: ['stat-1', 'stat-2'],
        },
        'stat-1': {
          type: 'statCard',
          props: { label: 'Users', value: 100, trend: 'up' },
        },
        'stat-2': {
          type: 'statCard',
          props: { label: 'Revenue', value: '$50k', trend: 'up' },
        },
      },
    };

    const result = parseUITree(complexTree);
    expect(result).not.toBeNull();
    expect(result?.root).toBe('stack-1');
    expect(Object.keys(result?.elements || {})).toHaveLength(5);
  });
});

// ============================================================================
// ClawAIJsonRenderProvider TESTS
// ============================================================================

// Mock useRouter
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

describe('ClawAIJsonRenderProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children', () => {
    render(
      <ClawAIJsonRenderProvider>
        <div data-testid="child">Child content</div>
      </ClawAIJsonRenderProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('should accept initialData prop', () => {
    const initialData = { testKey: 'testValue' };

    render(
      <ClawAIJsonRenderProvider initialData={initialData}>
        <div>Content</div>
      </ClawAIJsonRenderProvider>
    );

    // Provider should render without errors
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should accept onDataChange callback', () => {
    const onDataChange = vi.fn();

    render(
      <ClawAIJsonRenderProvider onDataChange={onDataChange}>
        <div>Content</div>
      </ClawAIJsonRenderProvider>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should provide navigate action handler', async () => {
    const tree: UITree = {
      root: 'btn-1',
      elements: {
        'btn-1': {
          type: 'button',
          props: {
            label: 'Go to Projects',
            action: { type: 'navigate', params: { path: '/projects' } },
          },
        },
      },
    };

    render(
      <ClawAIJsonRenderProvider>
        <ClawAIUIRenderer tree={tree} />
      </ClawAIJsonRenderProvider>
    );

    const button = screen.getByText('Go to Projects');
    expect(button).toBeInTheDocument();
  });

  it('should provide openUrl action handler', async () => {
    const tree: UITree = {
      root: 'link-1',
      elements: {
        'link-1': {
          type: 'button',
          props: {
            label: 'Open External',
            action: { type: 'openUrl', params: { url: 'https://example.com', newTab: true } },
          },
        },
      },
    };

    render(
      <ClawAIJsonRenderProvider>
        <ClawAIUIRenderer tree={tree} />
      </ClawAIJsonRenderProvider>
    );

    const button = screen.getByText('Open External');
    expect(button).toBeInTheDocument();
  });

  it('should provide showToast action handler', async () => {
    const tree: UITree = {
      root: 'btn-1',
      elements: {
        'btn-1': {
          type: 'button',
          props: {
            label: 'Show Toast',
            action: { type: 'showToast', params: { message: 'Hello!' } },
          },
        },
      },
    };

    render(
      <ClawAIJsonRenderProvider>
        <ClawAIUIRenderer tree={tree} />
      </ClawAIJsonRenderProvider>
    );

    const button = screen.getByText('Show Toast');
    expect(button).toBeInTheDocument();
  });
});

// ============================================================================
// ClawAIUIRenderer TESTS
// ============================================================================

describe('ClawAIUIRenderer', () => {
  it('should return null for null tree', () => {
    const { container } = render(<ClawAIUIRenderer tree={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render a simple text element', () => {
    const tree: UITree = {
      root: 'text-1',
      elements: {
        'text-1': {
          type: 'text',
          props: { content: 'Hello World' },
        },
      },
    };

    render(
      <ClawAIJsonRenderProvider>
        <ClawAIUIRenderer tree={tree} />
      </ClawAIJsonRenderProvider>
    );

    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should render a heading element', () => {
    const tree: UITree = {
      root: 'heading-1',
      elements: {
        'heading-1': {
          type: 'heading',
          props: { content: 'Test Heading', level: 'h2' },
        },
      },
    };

    render(
      <ClawAIJsonRenderProvider>
        <ClawAIUIRenderer tree={tree} />
      </ClawAIJsonRenderProvider>
    );

    const heading = screen.getByText('Test Heading');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H2');
  });

  it('should render nested stack with children', () => {
    const tree: UITree = {
      root: 'stack-1',
      elements: {
        'stack-1': {
          type: 'stack',
          props: { direction: 'vertical', gap: 'md' },
          children: ['text-1', 'text-2'],
        },
        'text-1': {
          type: 'text',
          props: { content: 'First item' },
        },
        'text-2': {
          type: 'text',
          props: { content: 'Second item' },
        },
      },
    };

    render(
      <ClawAIJsonRenderProvider>
        <ClawAIUIRenderer tree={tree} />
      </ClawAIJsonRenderProvider>
    );

    expect(screen.getByText('First item')).toBeInTheDocument();
    expect(screen.getByText('Second item')).toBeInTheDocument();
  });

  it('should render a card with title and content', () => {
    const tree: UITree = {
      root: 'card-1',
      elements: {
        'card-1': {
          type: 'card',
          props: { title: 'My Card', description: 'Card description' },
          children: ['text-1'],
        },
        'text-1': {
          type: 'text',
          props: { content: 'Card content' },
        },
      },
    };

    render(
      <ClawAIJsonRenderProvider>
        <ClawAIUIRenderer tree={tree} />
      </ClawAIJsonRenderProvider>
    );

    expect(screen.getByText('My Card')).toBeInTheDocument();
    expect(screen.getByText('Card description')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should render a badge with variant', () => {
    const tree: UITree = {
      root: 'badge-1',
      elements: {
        'badge-1': {
          type: 'badge',
          props: { label: 'Success', variant: 'success' },
        },
      },
    };

    render(
      <ClawAIJsonRenderProvider>
        <ClawAIUIRenderer tree={tree} />
      </ClawAIJsonRenderProvider>
    );

    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('should render a stat card with trend', () => {
    const tree: UITree = {
      root: 'stat-1',
      elements: {
        'stat-1': {
          type: 'statCard',
          props: { label: 'Users', value: 1000, change: 15, trend: 'up' },
        },
      },
    };

    render(
      <ClawAIJsonRenderProvider>
        <ClawAIUIRenderer tree={tree} />
      </ClawAIJsonRenderProvider>
    );

    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument();
    expect(screen.getByText('15%')).toBeInTheDocument();
  });

  it('should render a progress bar', () => {
    const tree: UITree = {
      root: 'progress-1',
      elements: {
        'progress-1': {
          type: 'progress',
          props: { value: 75, label: 'Loading', showValue: true },
        },
      },
    };

    render(
      <ClawAIJsonRenderProvider>
        <ClawAIUIRenderer tree={tree} />
      </ClawAIJsonRenderProvider>
    );

    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('should render a code block', () => {
    const tree: UITree = {
      root: 'code-1',
      elements: {
        'code-1': {
          type: 'codeBlock',
          props: {
            code: 'const x = 1;',
            language: 'javascript',
            title: 'Example',
          },
        },
      },
    };

    render(
      <ClawAIJsonRenderProvider>
        <ClawAIUIRenderer tree={tree} />
      </ClawAIJsonRenderProvider>
    );

    expect(screen.getByText('Example')).toBeInTheDocument();
    expect(screen.getByText('javascript')).toBeInTheDocument();
    expect(screen.getByText('const x = 1;')).toBeInTheDocument();
  });

  it('should render an alert', () => {
    const tree: UITree = {
      root: 'alert-1',
      elements: {
        'alert-1': {
          type: 'alert',
          props: {
            title: 'Warning',
            message: 'This is a warning message',
            variant: 'warning',
          },
        },
      },
    };

    render(
      <ClawAIJsonRenderProvider>
        <ClawAIUIRenderer tree={tree} />
      </ClawAIJsonRenderProvider>
    );

    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('This is a warning message')).toBeInTheDocument();
  });

  it('should render a table with headers and rows', () => {
    const tree: UITree = {
      root: 'table-1',
      elements: {
        'table-1': {
          type: 'table',
          props: {
            headers: ['Name', 'Age', 'City'],
            rows: [
              ['Alice', '30', 'NYC'],
              ['Bob', '25', 'LA'],
            ],
          },
        },
      },
    };

    render(
      <ClawAIJsonRenderProvider>
        <ClawAIUIRenderer tree={tree} />
      </ClawAIJsonRenderProvider>
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('should render a grid with multiple columns', () => {
    const tree: UITree = {
      root: 'grid-1',
      elements: {
        'grid-1': {
          type: 'grid',
          props: { columns: 2, gap: 'md' },
          children: ['text-1', 'text-2', 'text-3', 'text-4'],
        },
        'text-1': { type: 'text', props: { content: 'Cell 1' } },
        'text-2': { type: 'text', props: { content: 'Cell 2' } },
        'text-3': { type: 'text', props: { content: 'Cell 3' } },
        'text-4': { type: 'text', props: { content: 'Cell 4' } },
      },
    };

    render(
      <ClawAIJsonRenderProvider>
        <ClawAIUIRenderer tree={tree} />
      </ClawAIJsonRenderProvider>
    );

    expect(screen.getByText('Cell 1')).toBeInTheDocument();
    expect(screen.getByText('Cell 2')).toBeInTheDocument();
    expect(screen.getByText('Cell 3')).toBeInTheDocument();
    expect(screen.getByText('Cell 4')).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    const tree: UITree = {
      root: 'text-1',
      elements: {
        'text-1': {
          type: 'text',
          props: { content: 'Loaded content' },
        },
      },
    };

    render(
      <ClawAIJsonRenderProvider>
        <ClawAIUIRenderer tree={tree} loading={true} />
      </ClawAIJsonRenderProvider>
    );

    // Content should still render even with loading flag
    expect(screen.getByText('Loaded content')).toBeInTheDocument();
  });
});

// ============================================================================
// COMPLEX UI TREE RENDERING TESTS
// ============================================================================

describe('Complex UI Tree Rendering', () => {
  it('should render a dashboard layout', () => {
    const dashboardTree: UITree = {
      root: 'container',
      elements: {
        container: {
          type: 'stack',
          props: { direction: 'vertical', gap: 'lg' },
          children: ['header', 'stats-grid', 'content'],
        },
        header: {
          type: 'heading',
          props: { content: 'Dashboard', level: 'h1' },
        },
        'stats-grid': {
          type: 'grid',
          props: { columns: 3, gap: 'md' },
          children: ['stat-users', 'stat-revenue', 'stat-orders'],
        },
        'stat-users': {
          type: 'statCard',
          props: { label: 'Users', value: 1234, trend: 'up', change: 12 },
        },
        'stat-revenue': {
          type: 'statCard',
          props: { label: 'Revenue', value: '$10k', trend: 'up', change: 8 },
        },
        'stat-orders': {
          type: 'statCard',
          props: { label: 'Orders', value: 567, trend: 'down', change: 3 },
        },
        content: {
          type: 'card',
          props: { title: 'Recent Activity' },
          children: ['activity-list'],
        },
        'activity-list': {
          type: 'list',
          props: { variant: 'none' },
          children: ['item-1', 'item-2'],
        },
        'item-1': {
          type: 'listItem',
          props: { content: 'User signed up', icon: 'user' },
        },
        'item-2': {
          type: 'listItem',
          props: { content: 'Order placed', icon: 'shopping-cart' },
        },
      },
    };

    render(
      <ClawAIJsonRenderProvider>
        <ClawAIUIRenderer tree={dashboardTree} />
      </ClawAIJsonRenderProvider>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('User signed up')).toBeInTheDocument();
    expect(screen.getByText('Order placed')).toBeInTheDocument();
  });

  it('should render a timeline', () => {
    const timelineTree: UITree = {
      root: 'timeline',
      elements: {
        timeline: {
          type: 'timeline',
          props: { variant: 'default' },
          children: ['event-1', 'event-2', 'event-3'],
        },
        'event-1': {
          type: 'timelineItem',
          props: {
            title: 'Project Started',
            description: 'Initial commit',
            date: 'Jan 1',
            status: 'completed',
          },
        },
        'event-2': {
          type: 'timelineItem',
          props: {
            title: 'Development',
            description: 'Building features',
            date: 'Jan 15',
            status: 'current',
          },
        },
        'event-3': {
          type: 'timelineItem',
          props: {
            title: 'Launch',
            description: 'Go live',
            date: 'Feb 1',
            status: 'upcoming',
          },
        },
      },
    };

    render(
      <ClawAIJsonRenderProvider>
        <ClawAIUIRenderer tree={timelineTree} />
      </ClawAIJsonRenderProvider>
    );

    expect(screen.getByText('Project Started')).toBeInTheDocument();
    expect(screen.getByText('Development')).toBeInTheDocument();
    expect(screen.getByText('Launch')).toBeInTheDocument();
  });

  it('should render a bar chart', () => {
    const chartTree: UITree = {
      root: 'chart',
      elements: {
        chart: {
          type: 'barChart',
          props: {
            title: 'Sales by Region',
            data: [
              { label: 'North', value: 100 },
              { label: 'South', value: 80 },
              { label: 'East', value: 120 },
              { label: 'West', value: 90 },
            ],
            showValues: true,
          },
        },
      },
    };

    render(
      <ClawAIJsonRenderProvider>
        <ClawAIUIRenderer tree={chartTree} />
      </ClawAIJsonRenderProvider>
    );

    expect(screen.getByText('Sales by Region')).toBeInTheDocument();
    expect(screen.getByText('North')).toBeInTheDocument();
    expect(screen.getByText('South')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('should render a task card', () => {
    const taskTree: UITree = {
      root: 'task',
      elements: {
        task: {
          type: 'taskCard',
          props: {
            title: 'Implement feature',
            description: 'Add new functionality',
            status: 'in-progress',
            priority: 'high',
            tags: ['frontend', 'urgent'],
            assignee: 'John',
            dueDate: 'Jan 20',
          },
        },
      },
    };

    render(
      <ClawAIJsonRenderProvider>
        <ClawAIUIRenderer tree={taskTree} />
      </ClawAIJsonRenderProvider>
    );

    expect(screen.getByText('Implement feature')).toBeInTheDocument();
    expect(screen.getByText('Add new functionality')).toBeInTheDocument();
    expect(screen.getByText('frontend')).toBeInTheDocument();
    expect(screen.getByText('urgent')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('should render a weather widget', () => {
    const weatherTree: UITree = {
      root: 'weather',
      elements: {
        weather: {
          type: 'weatherWidget',
          props: {
            location: 'San Francisco',
            temperature: 68,
            condition: 'sunny',
            humidity: 45,
            windSpeed: 12,
          },
        },
      },
    };

    render(
      <ClawAIJsonRenderProvider>
        <ClawAIUIRenderer tree={weatherTree} />
      </ClawAIJsonRenderProvider>
    );

    expect(screen.getByText('San Francisco')).toBeInTheDocument();
    expect(screen.getByText('68°F')).toBeInTheDocument();
    expect(screen.getByText('sunny')).toBeInTheDocument();
  });
});
