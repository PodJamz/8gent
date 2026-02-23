/**
 * Tests for json-render-catalog.ts
 *
 * Tests all Zod schemas for component validation
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { clawAICatalog } from '../json-render-catalog';

// Helper to get schema for a component
function getComponentSchema(componentType: string) {
  const component = clawAICatalog.components[componentType as keyof typeof clawAICatalog.components];
  return component?.props;
}

// Helper to get action schema
function getActionSchema(actionType: string) {
  const action = clawAICatalog.actions[actionType as keyof typeof clawAICatalog.actions];
  return action?.params;
}

// ============================================================================
// CATALOG STRUCTURE TESTS
// ============================================================================

describe('clawAICatalog structure', () => {
  it('should have a name', () => {
    expect(clawAICatalog.name).toBe('claw-ai');
  });

  it('should have components object', () => {
    expect(clawAICatalog.components).toBeDefined();
    expect(typeof clawAICatalog.components).toBe('object');
  });

  it('should have actions object', () => {
    expect(clawAICatalog.actions).toBeDefined();
    expect(typeof clawAICatalog.actions).toBe('object');
  });

  it('should have all expected component types', () => {
    const expectedComponents = [
      'text', 'heading',
      'card', 'stack', 'grid', 'divider',
      'button', 'link', 'badge', 'tag',
      'statCard', 'progress', 'avatar', 'icon',
      'list', 'listItem',
      'image',
      'codeBlock', 'inlineCode',
      'alert', 'callout',
      'table',
      'keyValue', 'keyValueList',
      'timeline', 'timelineItem',
      'barChart', 'pieChart',
      'weatherWidget', 'taskCard', 'projectCard', 'workExperienceCard',
      'themePreviewCard', 'photoGallery', 'skillBadge',
      'emptyState', 'skeleton',
    ];

    for (const component of expectedComponents) {
      expect(clawAICatalog.components).toHaveProperty(component);
    }
  });

  it('should have all expected action types', () => {
    const expectedActions = ['navigate', 'openUrl', 'showToast'];

    for (const action of expectedActions) {
      expect(clawAICatalog.actions).toHaveProperty(action);
    }
  });
});

// ============================================================================
// TEXT COMPONENT SCHEMAS
// ============================================================================

describe('Text component schemas', () => {
  describe('TextSchema', () => {
    const schema = getComponentSchema('text');

    it('should accept valid text props', () => {
      expect(() => schema.parse({ content: 'Hello' })).not.toThrow();
      expect(() => schema.parse({ content: 'Hello', variant: 'body' })).not.toThrow();
      expect(() => schema.parse({ content: 'Hello', variant: 'heading', className: 'custom' })).not.toThrow();
    });

    it('should require content', () => {
      expect(() => schema.parse({})).toThrow();
      expect(() => schema.parse({ variant: 'body' })).toThrow();
    });

    it('should validate variant enum', () => {
      expect(() => schema.parse({ content: 'Hello', variant: 'body' })).not.toThrow();
      expect(() => schema.parse({ content: 'Hello', variant: 'heading' })).not.toThrow();
      expect(() => schema.parse({ content: 'Hello', variant: 'subheading' })).not.toThrow();
      expect(() => schema.parse({ content: 'Hello', variant: 'caption' })).not.toThrow();
      expect(() => schema.parse({ content: 'Hello', variant: 'code' })).not.toThrow();
      expect(() => schema.parse({ content: 'Hello', variant: 'invalid' })).toThrow();
    });
  });

  describe('HeadingSchema', () => {
    const schema = getComponentSchema('heading');

    it('should accept valid heading props', () => {
      expect(() => schema.parse({ content: 'Title' })).not.toThrow();
      expect(() => schema.parse({ content: 'Title', level: 'h1' })).not.toThrow();
    });

    it('should require content', () => {
      expect(() => schema.parse({})).toThrow();
      expect(() => schema.parse({ level: 'h1' })).toThrow();
    });

    it('should validate level enum', () => {
      expect(() => schema.parse({ content: 'Title', level: 'h1' })).not.toThrow();
      expect(() => schema.parse({ content: 'Title', level: 'h2' })).not.toThrow();
      expect(() => schema.parse({ content: 'Title', level: 'h3' })).not.toThrow();
      expect(() => schema.parse({ content: 'Title', level: 'h4' })).not.toThrow();
      expect(() => schema.parse({ content: 'Title', level: 'h5' })).toThrow();
    });
  });
});

// ============================================================================
// LAYOUT COMPONENT SCHEMAS
// ============================================================================

describe('Layout component schemas', () => {
  describe('CardSchema', () => {
    const schema = getComponentSchema('card');

    it('should accept empty props', () => {
      expect(() => schema.parse({})).not.toThrow();
    });

    it('should accept all optional props', () => {
      expect(() => schema.parse({
        title: 'Card Title',
        description: 'Card description',
        variant: 'elevated',
      })).not.toThrow();
    });

    it('should validate variant enum', () => {
      expect(() => schema.parse({ variant: 'default' })).not.toThrow();
      expect(() => schema.parse({ variant: 'elevated' })).not.toThrow();
      expect(() => schema.parse({ variant: 'outlined' })).not.toThrow();
      expect(() => schema.parse({ variant: 'ghost' })).not.toThrow();
      expect(() => schema.parse({ variant: 'fancy' })).toThrow();
    });
  });

  describe('StackSchema', () => {
    const schema = getComponentSchema('stack');

    it('should accept empty props', () => {
      expect(() => schema.parse({})).not.toThrow();
    });

    it('should validate direction', () => {
      expect(() => schema.parse({ direction: 'horizontal' })).not.toThrow();
      expect(() => schema.parse({ direction: 'vertical' })).not.toThrow();
      expect(() => schema.parse({ direction: 'diagonal' })).toThrow();
    });

    it('should validate gap sizes', () => {
      const validGaps = ['none', 'xs', 'sm', 'md', 'lg', 'xl'];
      for (const gap of validGaps) {
        expect(() => schema.parse({ gap })).not.toThrow();
      }
      expect(() => schema.parse({ gap: 'xxl' })).toThrow();
    });

    it('should validate align', () => {
      expect(() => schema.parse({ align: 'start' })).not.toThrow();
      expect(() => schema.parse({ align: 'center' })).not.toThrow();
      expect(() => schema.parse({ align: 'end' })).not.toThrow();
      expect(() => schema.parse({ align: 'stretch' })).not.toThrow();
      expect(() => schema.parse({ align: 'baseline' })).toThrow();
    });

    it('should validate justify', () => {
      expect(() => schema.parse({ justify: 'start' })).not.toThrow();
      expect(() => schema.parse({ justify: 'center' })).not.toThrow();
      expect(() => schema.parse({ justify: 'end' })).not.toThrow();
      expect(() => schema.parse({ justify: 'between' })).not.toThrow();
      expect(() => schema.parse({ justify: 'around' })).not.toThrow();
      expect(() => schema.parse({ justify: 'evenly' })).toThrow();
    });
  });

  describe('GridSchema', () => {
    const schema = getComponentSchema('grid');

    it('should accept empty props', () => {
      expect(() => schema.parse({})).not.toThrow();
    });

    it('should validate columns range', () => {
      expect(() => schema.parse({ columns: 1 })).not.toThrow();
      expect(() => schema.parse({ columns: 3 })).not.toThrow();
      expect(() => schema.parse({ columns: 6 })).not.toThrow();
      expect(() => schema.parse({ columns: 0 })).toThrow();
      expect(() => schema.parse({ columns: 7 })).toThrow();
    });
  });

  describe('DividerSchema', () => {
    const schema = getComponentSchema('divider');

    it('should accept empty props', () => {
      expect(() => schema.parse({})).not.toThrow();
    });

    it('should validate orientation', () => {
      expect(() => schema.parse({ orientation: 'horizontal' })).not.toThrow();
      expect(() => schema.parse({ orientation: 'vertical' })).not.toThrow();
      expect(() => schema.parse({ orientation: 'diagonal' })).toThrow();
    });
  });
});

// ============================================================================
// INTERACTIVE COMPONENT SCHEMAS
// ============================================================================

describe('Interactive component schemas', () => {
  describe('ButtonSchema', () => {
    const schema = getComponentSchema('button');

    it('should require label', () => {
      expect(() => schema.parse({ label: 'Click me' })).not.toThrow();
      expect(() => schema.parse({})).toThrow();
    });

    it('should validate variant', () => {
      expect(() => schema.parse({ label: 'Btn', variant: 'primary' })).not.toThrow();
      expect(() => schema.parse({ label: 'Btn', variant: 'secondary' })).not.toThrow();
      expect(() => schema.parse({ label: 'Btn', variant: 'ghost' })).not.toThrow();
      expect(() => schema.parse({ label: 'Btn', variant: 'destructive' })).not.toThrow();
      expect(() => schema.parse({ label: 'Btn', variant: 'outline' })).toThrow();
    });

    it('should validate size', () => {
      expect(() => schema.parse({ label: 'Btn', size: 'sm' })).not.toThrow();
      expect(() => schema.parse({ label: 'Btn', size: 'md' })).not.toThrow();
      expect(() => schema.parse({ label: 'Btn', size: 'lg' })).not.toThrow();
      expect(() => schema.parse({ label: 'Btn', size: 'xl' })).toThrow();
    });

    it('should accept icon and disabled', () => {
      expect(() => schema.parse({
        label: 'Save',
        icon: 'check',
        disabled: true,
      })).not.toThrow();
    });
  });

  describe('LinkSchema', () => {
    const schema = getComponentSchema('link');

    it('should require label and href', () => {
      expect(() => schema.parse({ label: 'Click', href: '/page' })).not.toThrow();
      expect(() => schema.parse({ label: 'Click' })).toThrow();
      expect(() => schema.parse({ href: '/page' })).toThrow();
    });

    it('should accept external flag', () => {
      expect(() => schema.parse({
        label: 'External',
        href: 'https://example.com',
        external: true,
      })).not.toThrow();
    });
  });

  describe('BadgeSchema', () => {
    const schema = getComponentSchema('badge');

    it('should require label', () => {
      expect(() => schema.parse({ label: 'Status' })).not.toThrow();
      expect(() => schema.parse({})).toThrow();
    });

    it('should validate variant', () => {
      const validVariants = ['default', 'success', 'warning', 'error', 'info'];
      for (const variant of validVariants) {
        expect(() => schema.parse({ label: 'Status', variant })).not.toThrow();
      }
      expect(() => schema.parse({ label: 'Status', variant: 'danger' })).toThrow();
    });
  });

  describe('TagSchema', () => {
    const schema = getComponentSchema('tag');

    it('should require label', () => {
      expect(() => schema.parse({ label: 'Tag' })).not.toThrow();
      expect(() => schema.parse({})).toThrow();
    });

    it('should accept color and removable', () => {
      expect(() => schema.parse({
        label: 'Tag',
        color: '#ff0000',
        removable: true,
      })).not.toThrow();
    });
  });
});

// ============================================================================
// DATA DISPLAY COMPONENT SCHEMAS
// ============================================================================

describe('Data display component schemas', () => {
  describe('StatCardSchema', () => {
    const schema = getComponentSchema('statCard');

    it('should require label and value', () => {
      expect(() => schema.parse({ label: 'Users', value: 100 })).not.toThrow();
      expect(() => schema.parse({ label: 'Revenue', value: '$1000' })).not.toThrow();
      expect(() => schema.parse({ label: 'Users' })).toThrow();
      expect(() => schema.parse({ value: 100 })).toThrow();
    });

    it('should validate trend', () => {
      expect(() => schema.parse({ label: 'X', value: 1, trend: 'up' })).not.toThrow();
      expect(() => schema.parse({ label: 'X', value: 1, trend: 'down' })).not.toThrow();
      expect(() => schema.parse({ label: 'X', value: 1, trend: 'neutral' })).not.toThrow();
      expect(() => schema.parse({ label: 'X', value: 1, trend: 'sideways' })).toThrow();
    });

    it('should accept change and icon', () => {
      expect(() => schema.parse({
        label: 'Sales',
        value: 500,
        change: 15,
        icon: 'trending-up',
      })).not.toThrow();
    });
  });

  describe('ProgressSchema', () => {
    const schema = getComponentSchema('progress');

    it('should require value', () => {
      expect(() => schema.parse({ value: 50 })).not.toThrow();
      expect(() => schema.parse({})).toThrow();
    });

    it('should validate value range', () => {
      expect(() => schema.parse({ value: 0 })).not.toThrow();
      expect(() => schema.parse({ value: 50 })).not.toThrow();
      expect(() => schema.parse({ value: 100 })).not.toThrow();
      expect(() => schema.parse({ value: -1 })).toThrow();
      expect(() => schema.parse({ value: 101 })).toThrow();
    });

    it('should validate variant', () => {
      const validVariants = ['default', 'success', 'warning', 'error'];
      for (const variant of validVariants) {
        expect(() => schema.parse({ value: 50, variant })).not.toThrow();
      }
    });
  });

  describe('AvatarSchema', () => {
    const schema = getComponentSchema('avatar');

    it('should require alt', () => {
      expect(() => schema.parse({ alt: 'User name' })).not.toThrow();
      expect(() => schema.parse({})).toThrow();
    });

    it('should accept src and fallback', () => {
      expect(() => schema.parse({
        alt: 'User',
        src: 'https://example.com/avatar.jpg',
        fallback: 'JD',
      })).not.toThrow();
    });

    it('should validate size', () => {
      const validSizes = ['xs', 'sm', 'md', 'lg', 'xl'];
      for (const size of validSizes) {
        expect(() => schema.parse({ alt: 'User', size })).not.toThrow();
      }
      expect(() => schema.parse({ alt: 'User', size: 'xxl' })).toThrow();
    });
  });

  describe('IconSchema', () => {
    const schema = getComponentSchema('icon');

    it('should require name', () => {
      expect(() => schema.parse({ name: 'check' })).not.toThrow();
      expect(() => schema.parse({})).toThrow();
    });

    it('should accept size and color', () => {
      expect(() => schema.parse({
        name: 'star',
        size: 'lg',
        color: '#gold',
      })).not.toThrow();
    });
  });
});

// ============================================================================
// LIST COMPONENT SCHEMAS
// ============================================================================

describe('List component schemas', () => {
  describe('ListSchema', () => {
    const schema = getComponentSchema('list');

    it('should accept empty props', () => {
      expect(() => schema.parse({})).not.toThrow();
    });

    it('should validate variant', () => {
      expect(() => schema.parse({ variant: 'unordered' })).not.toThrow();
      expect(() => schema.parse({ variant: 'ordered' })).not.toThrow();
      expect(() => schema.parse({ variant: 'none' })).not.toThrow();
      expect(() => schema.parse({ variant: 'bulleted' })).toThrow();
    });
  });

  describe('ListItemSchema', () => {
    const schema = getComponentSchema('listItem');

    it('should require content', () => {
      expect(() => schema.parse({ content: 'Item text' })).not.toThrow();
      expect(() => schema.parse({})).toThrow();
    });

    it('should accept icon', () => {
      expect(() => schema.parse({ content: 'Item', icon: 'check' })).not.toThrow();
    });
  });
});

// ============================================================================
// CODE COMPONENT SCHEMAS
// ============================================================================

describe('Code component schemas', () => {
  describe('CodeBlockSchema', () => {
    const schema = getComponentSchema('codeBlock');

    it('should require code', () => {
      expect(() => schema.parse({ code: 'const x = 1;' })).not.toThrow();
      expect(() => schema.parse({})).toThrow();
    });

    it('should accept all optional props', () => {
      expect(() => schema.parse({
        code: 'function test() {}',
        language: 'javascript',
        showLineNumbers: true,
        title: 'Example',
      })).not.toThrow();
    });
  });

  describe('InlineCodeSchema', () => {
    const schema = getComponentSchema('inlineCode');

    it('should require code', () => {
      expect(() => schema.parse({ code: 'npm install' })).not.toThrow();
      expect(() => schema.parse({})).toThrow();
    });
  });
});

// ============================================================================
// ALERT COMPONENT SCHEMAS
// ============================================================================

describe('Alert component schemas', () => {
  describe('AlertSchema', () => {
    const schema = getComponentSchema('alert');

    it('should require message', () => {
      expect(() => schema.parse({ message: 'Alert message' })).not.toThrow();
      expect(() => schema.parse({})).toThrow();
    });

    it('should validate variant', () => {
      const validVariants = ['info', 'success', 'warning', 'error'];
      for (const variant of validVariants) {
        expect(() => schema.parse({ message: 'Msg', variant })).not.toThrow();
      }
      expect(() => schema.parse({ message: 'Msg', variant: 'danger' })).toThrow();
    });

    it('should accept title and dismissible', () => {
      expect(() => schema.parse({
        title: 'Alert Title',
        message: 'Message',
        dismissible: true,
      })).not.toThrow();
    });
  });

  describe('CalloutSchema', () => {
    const schema = getComponentSchema('callout');

    it('should require content', () => {
      expect(() => schema.parse({ content: 'Callout text' })).not.toThrow();
      expect(() => schema.parse({})).toThrow();
    });

    it('should validate variant', () => {
      const validVariants = ['note', 'tip', 'important', 'warning', 'caution'];
      for (const variant of validVariants) {
        expect(() => schema.parse({ content: 'Text', variant })).not.toThrow();
      }
    });
  });
});

// ============================================================================
// TABLE COMPONENT SCHEMA
// ============================================================================

describe('TableSchema', () => {
  const schema = getComponentSchema('table');

  it('should require headers and rows', () => {
    expect(() => schema.parse({
      headers: ['Col1', 'Col2'],
      rows: [['a', 'b']],
    })).not.toThrow();
    expect(() => schema.parse({ headers: ['Col1'] })).toThrow();
    expect(() => schema.parse({ rows: [['a']] })).toThrow();
  });

  it('should accept caption', () => {
    expect(() => schema.parse({
      headers: ['Name'],
      rows: [['John']],
      caption: 'User list',
    })).not.toThrow();
  });
});

// ============================================================================
// CHART COMPONENT SCHEMAS
// ============================================================================

describe('Chart component schemas', () => {
  describe('BarChartSchema', () => {
    const schema = getComponentSchema('barChart');

    it('should require data array', () => {
      expect(() => schema.parse({
        data: [{ label: 'A', value: 10 }],
      })).not.toThrow();
      expect(() => schema.parse({})).toThrow();
    });

    it('should validate data item structure', () => {
      expect(() => schema.parse({
        data: [{ label: 'A', value: 10, color: '#f00' }],
      })).not.toThrow();

      expect(() => schema.parse({
        data: [{ label: 'A' }],
      })).toThrow();
    });

    it('should accept optional props', () => {
      expect(() => schema.parse({
        data: [{ label: 'A', value: 10 }],
        title: 'Chart Title',
        showValues: true,
        maxValue: 100,
      })).not.toThrow();
    });
  });

  describe('PieChartSchema', () => {
    const schema = getComponentSchema('pieChart');

    it('should require data array', () => {
      expect(() => schema.parse({
        data: [{ label: 'A', value: 30 }],
      })).not.toThrow();
      expect(() => schema.parse({})).toThrow();
    });

    it('should accept optional props', () => {
      expect(() => schema.parse({
        data: [{ label: 'A', value: 30 }],
        title: 'Distribution',
        showLegend: true,
      })).not.toThrow();
    });
  });
});

// ============================================================================
// PORTFOLIO-SPECIFIC COMPONENT SCHEMAS
// ============================================================================

describe('Portfolio-specific component schemas', () => {
  describe('WeatherWidgetSchema', () => {
    const schema = getComponentSchema('weatherWidget');

    it('should require location, temperature, and condition', () => {
      expect(() => schema.parse({
        location: 'NYC',
        temperature: 70,
        condition: 'sunny',
      })).not.toThrow();
      expect(() => schema.parse({ location: 'NYC' })).toThrow();
    });

    it('should validate condition enum', () => {
      const validConditions = ['sunny', 'cloudy', 'rainy', 'windy', 'snowy'];
      for (const condition of validConditions) {
        expect(() => schema.parse({
          location: 'Test',
          temperature: 65,
          condition,
        })).not.toThrow();
      }
      expect(() => schema.parse({
        location: 'Test',
        temperature: 65,
        condition: 'foggy',
      })).toThrow();
    });
  });

  describe('TaskCardSchema', () => {
    const schema = getComponentSchema('taskCard');

    it('should require title and status', () => {
      expect(() => schema.parse({
        title: 'Task',
        status: 'todo',
      })).not.toThrow();
      expect(() => schema.parse({ title: 'Task' })).toThrow();
    });

    it('should validate status and priority', () => {
      const validStatuses = ['todo', 'in-progress', 'done', 'backlog'];
      const validPriorities = ['low', 'medium', 'high', 'urgent'];

      for (const status of validStatuses) {
        expect(() => schema.parse({ title: 'T', status })).not.toThrow();
      }

      for (const priority of validPriorities) {
        expect(() => schema.parse({ title: 'T', status: 'todo', priority })).not.toThrow();
      }
    });

    it('should accept all optional fields', () => {
      expect(() => schema.parse({
        title: 'Task',
        status: 'in-progress',
        description: 'Description',
        priority: 'high',
        tags: ['frontend', 'bug'],
        assignee: 'John',
        dueDate: '2024-01-15',
      })).not.toThrow();
    });
  });

  describe('ProjectCardSchema', () => {
    const schema = getComponentSchema('projectCard');

    it('should require title', () => {
      expect(() => schema.parse({ title: 'Project' })).not.toThrow();
      expect(() => schema.parse({})).toThrow();
    });

    it('should accept all optional fields', () => {
      expect(() => schema.parse({
        title: 'My Project',
        description: 'A cool project',
        technologies: ['React', 'TypeScript'],
        url: 'https://project.com',
        image: 'https://example.com/image.jpg',
      })).not.toThrow();
    });
  });

  describe('WorkExperienceCardSchema', () => {
    const schema = getComponentSchema('workExperienceCard');

    it('should require company, role, and period', () => {
      expect(() => schema.parse({
        company: 'Acme',
        role: 'Engineer',
        period: '2020-2024',
      })).not.toThrow();
      expect(() => schema.parse({ company: 'Acme' })).toThrow();
    });
  });
});

// ============================================================================
// ACTION SCHEMAS
// ============================================================================

describe('Action schemas', () => {
  describe('NavigateActionSchema', () => {
    const schema = getActionSchema('navigate');

    it('should require path', () => {
      expect(() => schema.parse({ path: '/dashboard' })).not.toThrow();
      expect(() => schema.parse({})).toThrow();
    });
  });

  describe('OpenUrlActionSchema', () => {
    const schema = getActionSchema('openUrl');

    it('should require url', () => {
      expect(() => schema.parse({ url: 'https://example.com' })).not.toThrow();
      expect(() => schema.parse({})).toThrow();
    });

    it('should accept newTab flag', () => {
      expect(() => schema.parse({
        url: 'https://example.com',
        newTab: true,
      })).not.toThrow();
    });
  });

  describe('ShowToastActionSchema', () => {
    const schema = getActionSchema('showToast');

    it('should require message', () => {
      expect(() => schema.parse({ message: 'Saved!' })).not.toThrow();
      expect(() => schema.parse({})).toThrow();
    });

    it('should validate variant', () => {
      const validVariants = ['info', 'success', 'warning', 'error'];
      for (const variant of validVariants) {
        expect(() => schema.parse({ message: 'Msg', variant })).not.toThrow();
      }
    });
  });
});

// ============================================================================
// UTILITY COMPONENT SCHEMAS
// ============================================================================

describe('Utility component schemas', () => {
  describe('EmptyStateSchema', () => {
    const schema = getComponentSchema('emptyState');

    it('should require title', () => {
      expect(() => schema.parse({ title: 'No data' })).not.toThrow();
      expect(() => schema.parse({})).toThrow();
    });

    it('should accept optional fields', () => {
      expect(() => schema.parse({
        title: 'No results',
        message: 'Try a different search',
        icon: 'search',
        actionLabel: 'Clear filters',
      })).not.toThrow();
    });
  });

  describe('SkeletonSchema', () => {
    const schema = getComponentSchema('skeleton');

    it('should accept empty props', () => {
      expect(() => schema.parse({})).not.toThrow();
    });

    it('should validate variant', () => {
      const validVariants = ['text', 'circular', 'rectangular', 'card'];
      for (const variant of validVariants) {
        expect(() => schema.parse({ variant })).not.toThrow();
      }
    });

    it('should accept dimensions and count', () => {
      expect(() => schema.parse({
        width: 100,
        height: 20,
        count: 3,
      })).not.toThrow();

      expect(() => schema.parse({
        width: '100%',
        height: '50px',
      })).not.toThrow();
    });
  });
});
