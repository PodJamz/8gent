/**
 * Tests for json-render-registry.tsx
 *
 * Tests that all 48 registered components render correctly
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { clawAIRegistry, fallbackRenderer } from '../json-render-registry';
import type { ComponentRenderProps } from '@json-render/react';

// Helper to render a component from the registry
function renderRegistryComponent(
  type: string,
  props: Record<string, unknown>,
  children?: React.ReactNode
) {
  const Component = clawAIRegistry[type];
  if (!Component) {
    throw new Error(`Component ${type} not found in registry`);
  }

  const element = {
    type,
    props,
    children: undefined,
  };

  const renderProps: ComponentRenderProps = {
    element,
    children,
    onAction: () => {},
  };

  return render(<Component {...renderProps} />);
}

// ============================================================================
// REGISTRY STRUCTURE TESTS
// ============================================================================

describe('clawAIRegistry structure', () => {
  it('should export registry object', () => {
    expect(clawAIRegistry).toBeDefined();
    expect(typeof clawAIRegistry).toBe('object');
  });

  it('should have 37 registered components', () => {
    const componentCount = Object.keys(clawAIRegistry).length;
    expect(componentCount).toBe(37);
  });

  it('should export fallbackRenderer', () => {
    expect(fallbackRenderer).toBeDefined();
    expect(typeof fallbackRenderer).toBe('function');
  });

  it('should have all text components', () => {
    expect(clawAIRegistry).toHaveProperty('text');
    expect(clawAIRegistry).toHaveProperty('heading');
  });

  it('should have all layout components', () => {
    expect(clawAIRegistry).toHaveProperty('card');
    expect(clawAIRegistry).toHaveProperty('stack');
    expect(clawAIRegistry).toHaveProperty('grid');
    expect(clawAIRegistry).toHaveProperty('divider');
  });

  it('should have all interactive components', () => {
    expect(clawAIRegistry).toHaveProperty('button');
    expect(clawAIRegistry).toHaveProperty('link');
    expect(clawAIRegistry).toHaveProperty('badge');
    expect(clawAIRegistry).toHaveProperty('tag');
  });

  it('should have all data display components', () => {
    expect(clawAIRegistry).toHaveProperty('statCard');
    expect(clawAIRegistry).toHaveProperty('progress');
    expect(clawAIRegistry).toHaveProperty('avatar');
    expect(clawAIRegistry).toHaveProperty('icon');
  });

  it('should have all list components', () => {
    expect(clawAIRegistry).toHaveProperty('list');
    expect(clawAIRegistry).toHaveProperty('listItem');
  });

  it('should have all media components', () => {
    expect(clawAIRegistry).toHaveProperty('image');
  });

  it('should have all code components', () => {
    expect(clawAIRegistry).toHaveProperty('codeBlock');
    expect(clawAIRegistry).toHaveProperty('inlineCode');
  });

  it('should have all alert components', () => {
    expect(clawAIRegistry).toHaveProperty('alert');
    expect(clawAIRegistry).toHaveProperty('callout');
  });

  it('should have table component', () => {
    expect(clawAIRegistry).toHaveProperty('table');
  });

  it('should have all key-value components', () => {
    expect(clawAIRegistry).toHaveProperty('keyValue');
    expect(clawAIRegistry).toHaveProperty('keyValueList');
  });

  it('should have all timeline components', () => {
    expect(clawAIRegistry).toHaveProperty('timeline');
    expect(clawAIRegistry).toHaveProperty('timelineItem');
  });

  it('should have all chart components', () => {
    expect(clawAIRegistry).toHaveProperty('barChart');
    expect(clawAIRegistry).toHaveProperty('pieChart');
  });

  it('should have all portfolio-specific components', () => {
    expect(clawAIRegistry).toHaveProperty('weatherWidget');
    expect(clawAIRegistry).toHaveProperty('taskCard');
    expect(clawAIRegistry).toHaveProperty('projectCard');
    expect(clawAIRegistry).toHaveProperty('workExperienceCard');
    expect(clawAIRegistry).toHaveProperty('themePreviewCard');
    expect(clawAIRegistry).toHaveProperty('photoGallery');
    expect(clawAIRegistry).toHaveProperty('skillBadge');
  });

  it('should have all utility components', () => {
    expect(clawAIRegistry).toHaveProperty('emptyState');
    expect(clawAIRegistry).toHaveProperty('skeleton');
  });
});

// ============================================================================
// TEXT COMPONENT RENDERING TESTS
// ============================================================================

describe('Text component rendering', () => {
  it('should render text with body variant', () => {
    renderRegistryComponent('text', { content: 'Body text', variant: 'body' });
    expect(screen.getByText('Body text')).toBeInTheDocument();
  });

  it('should render text with heading variant', () => {
    renderRegistryComponent('text', { content: 'Heading text', variant: 'heading' });
    expect(screen.getByText('Heading text')).toBeInTheDocument();
  });

  it('should render text with subheading variant', () => {
    renderRegistryComponent('text', { content: 'Subheading', variant: 'subheading' });
    expect(screen.getByText('Subheading')).toBeInTheDocument();
  });

  it('should render text with caption variant', () => {
    renderRegistryComponent('text', { content: 'Caption', variant: 'caption' });
    expect(screen.getByText('Caption')).toBeInTheDocument();
  });

  it('should render text with code variant', () => {
    renderRegistryComponent('text', { content: 'code text', variant: 'code' });
    expect(screen.getByText('code text')).toBeInTheDocument();
  });

  it('should render heading with correct level', () => {
    renderRegistryComponent('heading', { content: 'H1 Heading', level: 'h1' });
    const heading = screen.getByText('H1 Heading');
    expect(heading.tagName).toBe('H1');
  });

  it('should render h2 heading', () => {
    renderRegistryComponent('heading', { content: 'H2 Heading', level: 'h2' });
    const heading = screen.getByText('H2 Heading');
    expect(heading.tagName).toBe('H2');
  });

  it('should render h3 heading', () => {
    renderRegistryComponent('heading', { content: 'H3 Heading', level: 'h3' });
    const heading = screen.getByText('H3 Heading');
    expect(heading.tagName).toBe('H3');
  });

  it('should render h4 heading', () => {
    renderRegistryComponent('heading', { content: 'H4 Heading', level: 'h4' });
    const heading = screen.getByText('H4 Heading');
    expect(heading.tagName).toBe('H4');
  });
});

// ============================================================================
// LAYOUT COMPONENT RENDERING TESTS
// ============================================================================

describe('Layout component rendering', () => {
  it('should render card with title', () => {
    renderRegistryComponent('card', { title: 'Card Title' });
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('should render card with description', () => {
    renderRegistryComponent('card', { title: 'Title', description: 'Description text' });
    expect(screen.getByText('Description text')).toBeInTheDocument();
  });

  it('should render card with children', () => {
    renderRegistryComponent('card', { title: 'Card' }, <span>Child content</span>);
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('should render stack with children', () => {
    renderRegistryComponent('stack', { direction: 'vertical', gap: 'md' }, (
      <>
        <span>Item 1</span>
        <span>Item 2</span>
      </>
    ));
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('should render horizontal stack', () => {
    const { container } = renderRegistryComponent('stack', { direction: 'horizontal' });
    expect(container.querySelector('.flex-row')).toBeInTheDocument();
  });

  it('should render vertical stack', () => {
    const { container } = renderRegistryComponent('stack', { direction: 'vertical' });
    expect(container.querySelector('.flex-col')).toBeInTheDocument();
  });

  it('should render grid with children', () => {
    renderRegistryComponent('grid', { columns: 2 }, (
      <>
        <span>Cell 1</span>
        <span>Cell 2</span>
      </>
    ));
    expect(screen.getByText('Cell 1')).toBeInTheDocument();
    expect(screen.getByText('Cell 2')).toBeInTheDocument();
  });

  it('should render divider', () => {
    const { container } = renderRegistryComponent('divider', {});
    expect(container.firstChild).toBeInTheDocument();
  });
});

// ============================================================================
// INTERACTIVE COMPONENT RENDERING TESTS
// ============================================================================

describe('Interactive component rendering', () => {
  it('should render button with label', () => {
    renderRegistryComponent('button', { label: 'Click Me' });
    expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
  });

  it('should render disabled button', () => {
    renderRegistryComponent('button', { label: 'Disabled', disabled: true });
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should render link', () => {
    renderRegistryComponent('link', { label: 'Go to page', href: '/page' });
    const link = screen.getByText('Go to page');
    expect(link.closest('a')).toHaveAttribute('href', '/page');
  });

  it('should render external link with icon', () => {
    renderRegistryComponent('link', { label: 'External', href: 'https://example.com', external: true });
    const link = screen.getByText('External');
    expect(link.closest('a')).toHaveAttribute('target', '_blank');
  });

  it('should render badge', () => {
    renderRegistryComponent('badge', { label: 'New', variant: 'success' });
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('should render tag', () => {
    renderRegistryComponent('tag', { label: 'React' });
    expect(screen.getByText('React')).toBeInTheDocument();
  });
});

// ============================================================================
// DATA DISPLAY COMPONENT RENDERING TESTS
// ============================================================================

describe('Data display component rendering', () => {
  it('should render stat card', () => {
    renderRegistryComponent('statCard', { label: 'Users', value: 1234 });
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();
  });

  it('should render stat card with trend', () => {
    renderRegistryComponent('statCard', { label: 'Revenue', value: '$10k', change: 15, trend: 'up' });
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$10k')).toBeInTheDocument();
    expect(screen.getByText('15%')).toBeInTheDocument();
  });

  it('should render progress bar', () => {
    renderRegistryComponent('progress', { value: 75, label: 'Progress', showValue: true });
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('should render avatar with fallback', () => {
    renderRegistryComponent('avatar', { alt: 'John Doe', fallback: 'JD' });
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('should render avatar with image', () => {
    renderRegistryComponent('avatar', { alt: 'User', src: '/avatar.jpg' });
    expect(screen.getByAltText('User')).toBeInTheDocument();
  });

  it('should render icon', () => {
    const { container } = renderRegistryComponent('icon', { name: 'check', size: 'md' });
    // Icon should render an SVG
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

// ============================================================================
// LIST COMPONENT RENDERING TESTS
// ============================================================================

describe('List component rendering', () => {
  it('should render unordered list', () => {
    const { container } = renderRegistryComponent('list', { variant: 'unordered' });
    expect(container.querySelector('ul')).toBeInTheDocument();
  });

  it('should render ordered list', () => {
    const { container } = renderRegistryComponent('list', { variant: 'ordered' });
    expect(container.querySelector('ol')).toBeInTheDocument();
  });

  it('should render list item', () => {
    renderRegistryComponent('listItem', { content: 'List item text' });
    expect(screen.getByText('List item text')).toBeInTheDocument();
  });
});

// ============================================================================
// CODE COMPONENT RENDERING TESTS
// ============================================================================

describe('Code component rendering', () => {
  it('should render code block', () => {
    renderRegistryComponent('codeBlock', { code: 'const x = 1;', language: 'javascript' });
    expect(screen.getByText('const x = 1;')).toBeInTheDocument();
    expect(screen.getByText('javascript')).toBeInTheDocument();
  });

  it('should render code block with title', () => {
    renderRegistryComponent('codeBlock', { code: 'code', title: 'Example Code' });
    expect(screen.getByText('Example Code')).toBeInTheDocument();
  });

  it('should render code block with line numbers', () => {
    renderRegistryComponent('codeBlock', { code: 'line1\nline2', showLineNumbers: true });
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render inline code', () => {
    renderRegistryComponent('inlineCode', { code: 'npm install' });
    expect(screen.getByText('npm install')).toBeInTheDocument();
  });
});

// ============================================================================
// ALERT COMPONENT RENDERING TESTS
// ============================================================================

describe('Alert component rendering', () => {
  it('should render alert with message', () => {
    renderRegistryComponent('alert', { message: 'Alert message' });
    expect(screen.getByText('Alert message')).toBeInTheDocument();
  });

  it('should render alert with title', () => {
    renderRegistryComponent('alert', { title: 'Alert Title', message: 'Message' });
    expect(screen.getByText('Alert Title')).toBeInTheDocument();
  });

  it('should render callout', () => {
    renderRegistryComponent('callout', { content: 'Callout content', variant: 'tip' });
    expect(screen.getByText('Callout content')).toBeInTheDocument();
  });
});

// ============================================================================
// TABLE COMPONENT RENDERING TESTS
// ============================================================================

describe('Table component rendering', () => {
  it('should render table with headers and rows', () => {
    renderRegistryComponent('table', {
      headers: ['Name', 'Age'],
      rows: [
        ['Alice', '30'],
        ['Bob', '25'],
      ],
    });

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('should render table with caption', () => {
    renderRegistryComponent('table', {
      headers: ['Col'],
      rows: [['Data']],
      caption: 'Table caption',
    });

    expect(screen.getByText('Table caption')).toBeInTheDocument();
  });
});

// ============================================================================
// KEY-VALUE COMPONENT RENDERING TESTS
// ============================================================================

describe('Key-value component rendering', () => {
  it('should render key-value pair', () => {
    renderRegistryComponent('keyValue', { label: 'Status', value: 'Active' });
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should render key-value list', () => {
    renderRegistryComponent('keyValueList', {
      items: [
        { label: 'Name', value: 'John' },
        { label: 'Email', value: 'john@test.com' },
      ],
    });

    expect(screen.getByText('Name:')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
  });
});

// ============================================================================
// TIMELINE COMPONENT RENDERING TESTS
// ============================================================================

describe('Timeline component rendering', () => {
  it('should render timeline container', () => {
    const { container } = renderRegistryComponent('timeline', { variant: 'default' });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render timeline item', () => {
    renderRegistryComponent('timelineItem', {
      title: 'Event Title',
      description: 'Event description',
      date: 'Jan 1',
    });

    expect(screen.getByText('Event Title')).toBeInTheDocument();
    expect(screen.getByText('Event description')).toBeInTheDocument();
    expect(screen.getByText('Jan 1')).toBeInTheDocument();
  });
});

// ============================================================================
// CHART COMPONENT RENDERING TESTS
// ============================================================================

describe('Chart component rendering', () => {
  it('should render bar chart', () => {
    renderRegistryComponent('barChart', {
      data: [
        { label: 'A', value: 10 },
        { label: 'B', value: 20 },
      ],
      title: 'Bar Chart',
    });

    expect(screen.getByText('Bar Chart')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('should render bar chart with values', () => {
    renderRegistryComponent('barChart', {
      data: [{ label: 'X', value: 50 }],
      showValues: true,
    });

    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('should render pie chart', () => {
    renderRegistryComponent('pieChart', {
      data: [
        { label: 'Red', value: 30 },
        { label: 'Blue', value: 70 },
      ],
      title: 'Pie Chart',
      showLegend: true,
    });

    expect(screen.getByText('Pie Chart')).toBeInTheDocument();
    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();
  });
});

// ============================================================================
// PORTFOLIO-SPECIFIC COMPONENT RENDERING TESTS
// ============================================================================

describe('Portfolio-specific component rendering', () => {
  it('should render weather widget', () => {
    renderRegistryComponent('weatherWidget', {
      location: 'New York',
      temperature: 72,
      condition: 'sunny',
      humidity: 50,
    });

    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('72°F')).toBeInTheDocument();
    expect(screen.getByText('sunny')).toBeInTheDocument();
  });

  it('should render task card', () => {
    renderRegistryComponent('taskCard', {
      title: 'Fix bug',
      description: 'Fix the login issue',
      status: 'in-progress',
      priority: 'high',
      tags: ['bug', 'urgent'],
    });

    expect(screen.getByText('Fix bug')).toBeInTheDocument();
    expect(screen.getByText('Fix the login issue')).toBeInTheDocument();
    expect(screen.getByText('bug')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('should render project card', () => {
    renderRegistryComponent('projectCard', {
      title: 'My Project',
      description: 'A cool project',
      technologies: ['React', 'TypeScript'],
    });

    expect(screen.getByText('My Project')).toBeInTheDocument();
    expect(screen.getByText('A cool project')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('should render work experience card', () => {
    renderRegistryComponent('workExperienceCard', {
      company: 'Acme Corp',
      role: 'Senior Engineer',
      period: '2020-2024',
      description: 'Built awesome stuff',
    });

    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Senior Engineer')).toBeInTheDocument();
    expect(screen.getByText('2020-2024')).toBeInTheDocument();
  });

  it('should render theme preview card', () => {
    renderRegistryComponent('themePreviewCard', { name: 'dark', label: 'Dark Theme' });
    expect(screen.getByText('Dark Theme')).toBeInTheDocument();
  });

  it('should render skill badge', () => {
    renderRegistryComponent('skillBadge', { name: 'React', level: 'expert' });
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText(/expert/)).toBeInTheDocument();
  });
});

// ============================================================================
// UTILITY COMPONENT RENDERING TESTS
// ============================================================================

describe('Utility component rendering', () => {
  it('should render empty state', () => {
    renderRegistryComponent('emptyState', {
      title: 'No items',
      message: 'Add some items to get started',
    });

    expect(screen.getByText('No items')).toBeInTheDocument();
    expect(screen.getByText('Add some items to get started')).toBeInTheDocument();
  });

  it('should render skeleton', () => {
    const { container } = renderRegistryComponent('skeleton', { variant: 'text', count: 3 });
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(3);
  });
});

// ============================================================================
// FALLBACK RENDERER TESTS
// ============================================================================

describe('Fallback renderer', () => {
  it('should render unknown component type message', () => {
    const element = {
      type: 'unknownType',
      props: { foo: 'bar' },
    };

    const { getByText } = render(
      fallbackRenderer({ element, children: null, onAction: () => {} })
    );

    expect(getByText(/Unknown component type: unknownType/)).toBeInTheDocument();
  });
});
