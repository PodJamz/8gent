/**
 * 8gent Component Catalog for json-render
 *
 * Defines the guardrailed components 8gent can render in chat.
 * These components are validated against Zod schemas before rendering.
 */

import { createCatalog, generateCatalogPrompt } from '@json-render/core';
import { z } from 'zod';

// ============================================================================
// COMPONENT SCHEMAS
// ============================================================================

// Text components
const TextSchema = z.object({
  content: z.string().describe('The text content to display'),
  variant: z
    .enum(['body', 'heading', 'subheading', 'caption', 'code'])
    .optional()
    .describe('Text style variant'),
  className: z.string().optional().describe('Additional CSS classes'),
});

const HeadingSchema = z.object({
  content: z.string().describe('The heading text'),
  level: z.enum(['h1', 'h2', 'h3', 'h4']).optional().describe('Heading level'),
});

// Layout components
const CardSchema = z.object({
  title: z.string().optional().describe('Card title'),
  description: z.string().optional().describe('Card description'),
  variant: z
    .enum(['default', 'elevated', 'outlined', 'ghost'])
    .optional()
    .describe('Card style variant'),
});

const StackSchema = z.object({
  direction: z
    .enum(['horizontal', 'vertical'])
    .optional()
    .describe('Stack direction'),
  gap: z.enum(['none', 'xs', 'sm', 'md', 'lg', 'xl']).optional().describe('Gap between items'),
  align: z
    .enum(['start', 'center', 'end', 'stretch'])
    .optional()
    .describe('Cross-axis alignment'),
  justify: z
    .enum(['start', 'center', 'end', 'between', 'around'])
    .optional()
    .describe('Main-axis justification'),
});

const GridSchema = z.object({
  columns: z.number().min(1).max(6).optional().describe('Number of columns'),
  gap: z.enum(['none', 'xs', 'sm', 'md', 'lg', 'xl']).optional().describe('Gap between items'),
});

const DividerSchema = z.object({
  orientation: z.enum(['horizontal', 'vertical']).optional(),
});

// Interactive components
const ButtonSchema = z.object({
  label: z.string().describe('Button label'),
  variant: z
    .enum(['primary', 'secondary', 'ghost', 'destructive'])
    .optional()
    .describe('Button style'),
  size: z.enum(['sm', 'md', 'lg']).optional().describe('Button size'),
  disabled: z.boolean().optional().describe('Whether button is disabled'),
  icon: z.string().optional().describe('Icon name (lucide icons)'),
});

const LinkSchema = z.object({
  label: z.string().describe('Link text'),
  href: z.string().describe('URL to navigate to'),
  external: z.boolean().optional().describe('Open in new tab'),
});

const BadgeSchema = z.object({
  label: z.string().describe('Badge text'),
  variant: z
    .enum(['default', 'success', 'warning', 'error', 'info'])
    .optional()
    .describe('Badge color variant'),
});

const TagSchema = z.object({
  label: z.string().describe('Tag text'),
  color: z.string().optional().describe('Tag color (CSS color or theme color)'),
  removable: z.boolean().optional().describe('Show remove button'),
});

// Data display components
const StatCardSchema = z.object({
  label: z.string().describe('Stat label'),
  value: z.union([z.string(), z.number()]).describe('Stat value'),
  change: z.number().optional().describe('Percentage change'),
  trend: z.enum(['up', 'down', 'neutral']).optional().describe('Trend direction'),
  icon: z.string().optional().describe('Icon name'),
});

const ProgressSchema = z.object({
  value: z.number().min(0).max(100).describe('Progress value (0-100)'),
  label: z.string().optional().describe('Progress label'),
  showValue: z.boolean().optional().describe('Show percentage value'),
  variant: z.enum(['default', 'success', 'warning', 'error']).optional(),
});

const AvatarSchema = z.object({
  src: z.string().optional().describe('Image URL'),
  alt: z.string().describe('Alt text / name'),
  fallback: z.string().optional().describe('Fallback initials'),
  size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).optional(),
});

const IconSchema = z.object({
  name: z.string().describe('Lucide icon name'),
  size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).optional(),
  color: z.string().optional().describe('Icon color'),
});

// List components
const ListSchema = z.object({
  variant: z.enum(['unordered', 'ordered', 'none']).optional(),
});

const ListItemSchema = z.object({
  content: z.string().describe('List item text'),
  icon: z.string().optional().describe('Icon name'),
});

// Media components
const ImageSchema = z.object({
  src: z.string().describe('Image URL'),
  alt: z.string().describe('Alt text'),
  width: z.number().optional(),
  height: z.number().optional(),
  caption: z.string().optional(),
});

// Code components
const CodeBlockSchema = z.object({
  code: z.string().describe('Code content'),
  language: z.string().optional().describe('Programming language'),
  showLineNumbers: z.boolean().optional(),
  title: z.string().optional().describe('Code block title'),
});

const InlineCodeSchema = z.object({
  code: z.string().describe('Code content'),
});

// Alert/Message components
const AlertSchema = z.object({
  title: z.string().optional().describe('Alert title'),
  message: z.string().describe('Alert message'),
  variant: z.enum(['info', 'success', 'warning', 'error']).optional(),
  dismissible: z.boolean().optional(),
});

const CalloutSchema = z.object({
  title: z.string().optional(),
  content: z.string().describe('Callout content'),
  variant: z.enum(['note', 'tip', 'important', 'warning', 'caution']).optional(),
  icon: z.string().optional(),
});

// Table components
const TableSchema = z.object({
  headers: z.array(z.string()).describe('Table column headers'),
  rows: z.array(z.array(z.string())).describe('Table data rows'),
  caption: z.string().optional(),
});

// Form-like display components (read-only)
const KeyValueSchema = z.object({
  label: z.string().describe('Key/label'),
  value: z.string().describe('Value'),
});

const KeyValueListSchema = z.object({
  items: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .describe('List of key-value pairs'),
  layout: z.enum(['horizontal', 'vertical', 'grid']).optional(),
});

// Timeline/Steps components
const TimelineSchema = z.object({
  variant: z.enum(['default', 'compact']).optional(),
});

const TimelineItemSchema = z.object({
  title: z.string().describe('Timeline item title'),
  description: z.string().optional(),
  date: z.string().optional(),
  status: z.enum(['completed', 'current', 'upcoming']).optional(),
  icon: z.string().optional(),
});

// Chart components (simple, no external libraries)
const SimpleBarChartSchema = z.object({
  data: z
    .array(
      z.object({
        label: z.string(),
        value: z.number(),
        color: z.string().optional(),
      })
    )
    .describe('Chart data'),
  title: z.string().optional(),
  showValues: z.boolean().optional(),
  maxValue: z.number().optional(),
});

const SimplePieChartSchema = z.object({
  data: z
    .array(
      z.object({
        label: z.string(),
        value: z.number(),
        color: z.string().optional(),
      })
    )
    .describe('Chart data'),
  title: z.string().optional(),
  showLegend: z.boolean().optional(),
});

// Weather widget (already exists, making it json-render compatible)
const WeatherWidgetSchema = z.object({
  location: z.string().describe('Location name'),
  temperature: z.number().describe('Temperature in Fahrenheit'),
  condition: z.enum(['sunny', 'cloudy', 'rainy', 'windy', 'snowy']).describe('Weather condition'),
  humidity: z.number().optional(),
  windSpeed: z.number().optional(),
});

// Kanban/Task card (already exists)
const TaskCardSchema = z.object({
  title: z.string().describe('Task title'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'done', 'backlog']).describe('Task status'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  tags: z.array(z.string()).optional(),
  assignee: z.string().optional(),
  dueDate: z.string().optional(),
});

// Project card (already exists)
const ProjectCardSchema = z.object({
  title: z.string().describe('Project name'),
  description: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  url: z.string().optional(),
  image: z.string().optional(),
});

// Work experience card (already exists)
const WorkExperienceCardSchema = z.object({
  company: z.string().describe('Company name'),
  role: z.string().describe('Job title'),
  period: z.string().describe('Employment period'),
  description: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  logo: z.string().optional(),
});

// Theme preview card (already exists)
const ThemePreviewCardSchema = z.object({
  name: z.string().describe('Theme slug'),
  label: z.string().describe('Theme display name'),
});

// Photo gallery (already exists)
const PhotoGallerySchema = z.object({
  photos: z
    .array(
      z.object({
        id: z.string(),
        src: z.string(),
        alt: z.string(),
        caption: z.string().optional(),
      })
    )
    .describe('Array of photos'),
});

// Skill badge/chip
const SkillBadgeSchema = z.object({
  name: z.string().describe('Skill name'),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  icon: z.string().optional(),
});

// Empty state
const EmptyStateSchema = z.object({
  title: z.string().describe('Empty state title'),
  message: z.string().optional(),
  icon: z.string().optional(),
  actionLabel: z.string().optional(),
});

// ============================================================================
// NEW COMPONENT SCHEMAS (v0.5.2 expansion)
// ============================================================================

// Form components
const InputSchema = z.object({
  label: z.string().optional().describe('Input label'),
  placeholder: z.string().optional().describe('Placeholder text'),
  value: z.string().optional().describe('Current value'),
  type: z.enum(['text', 'email', 'password', 'number', 'url', 'tel', 'search']).optional(),
  disabled: z.boolean().optional(),
  helperText: z.string().optional().describe('Helper text below input'),
});

const TextareaSchema = z.object({
  label: z.string().optional().describe('Textarea label'),
  placeholder: z.string().optional(),
  value: z.string().optional(),
  rows: z.number().min(1).max(20).optional(),
  disabled: z.boolean().optional(),
});

const SelectSchema = z.object({
  label: z.string().optional().describe('Select label'),
  placeholder: z.string().optional(),
  value: z.string().optional(),
  options: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })).describe('Available options'),
  disabled: z.boolean().optional(),
});

const CheckboxSchema = z.object({
  label: z.string().describe('Checkbox label'),
  checked: z.boolean().optional(),
  disabled: z.boolean().optional(),
});

const SwitchSchema = z.object({
  label: z.string().describe('Switch label'),
  checked: z.boolean().optional(),
  disabled: z.boolean().optional(),
  description: z.string().optional(),
});

const RadioGroupSchema = z.object({
  label: z.string().optional().describe('Radio group label'),
  value: z.string().optional(),
  options: z.array(z.object({
    label: z.string(),
    value: z.string(),
    description: z.string().optional(),
  })).describe('Radio options'),
  direction: z.enum(['horizontal', 'vertical']).optional(),
});

const SliderSchema = z.object({
  label: z.string().optional(),
  value: z.number().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  showValue: z.boolean().optional(),
});

const FormSchema = z.object({
  title: z.string().optional().describe('Form title'),
  description: z.string().optional(),
});

// Navigation components
const TabsSchema = z.object({
  activeTab: z.string().optional().describe('Currently active tab ID'),
  variant: z.enum(['default', 'pills', 'underline']).optional(),
});

const TabSchema = z.object({
  id: z.string().describe('Tab identifier'),
  label: z.string().describe('Tab label'),
  icon: z.string().optional(),
});

const TabContentSchema = z.object({
  tabId: z.string().describe('Tab ID this content belongs to'),
});

const BreadcrumbSchema = z.object({
  items: z.array(z.object({
    label: z.string(),
    href: z.string().optional(),
  })).describe('Breadcrumb items'),
  separator: z.string().optional(),
});

const PaginationSchema = z.object({
  currentPage: z.number().describe('Current page number'),
  totalPages: z.number().describe('Total number of pages'),
  showPageNumbers: z.boolean().optional(),
});

const StepperSchema = z.object({
  steps: z.array(z.object({
    label: z.string(),
    description: z.string().optional(),
    status: z.enum(['completed', 'current', 'upcoming']).optional(),
  })).describe('Stepper steps'),
  orientation: z.enum(['horizontal', 'vertical']).optional(),
});

// Extended layout components
const AccordionSchema = z.object({
  variant: z.enum(['default', 'bordered', 'ghost']).optional(),
  allowMultiple: z.boolean().optional(),
});

const AccordionItemSchema = z.object({
  title: z.string().describe('Accordion item title'),
  subtitle: z.string().optional(),
  defaultOpen: z.boolean().optional(),
  icon: z.string().optional(),
});

const DialogSchema = z.object({
  title: z.string().describe('Dialog title'),
  description: z.string().optional(),
  open: z.boolean().optional(),
});

const DrawerSchema = z.object({
  title: z.string().describe('Drawer title'),
  description: z.string().optional(),
  side: z.enum(['left', 'right', 'top', 'bottom']).optional(),
});

const TooltipSchema = z.object({
  content: z.string().describe('Tooltip text'),
  side: z.enum(['top', 'right', 'bottom', 'left']).optional(),
});

const SeparatorSchema = z.object({
  label: z.string().optional().describe('Optional label on separator'),
  variant: z.enum(['solid', 'dashed', 'dotted']).optional(),
});

// More data visualization
const LineChartSchema = z.object({
  data: z.array(z.object({
    label: z.string(),
    value: z.number(),
  })).describe('Data points'),
  title: z.string().optional(),
  showDots: z.boolean().optional(),
  showGrid: z.boolean().optional(),
  color: z.string().optional(),
});

const SparklineSchema = z.object({
  data: z.array(z.number()).describe('Numeric data points'),
  color: z.string().optional(),
  height: z.number().optional(),
  showArea: z.boolean().optional(),
});

const DonutChartSchema = z.object({
  data: z.array(z.object({
    label: z.string(),
    value: z.number(),
    color: z.string().optional(),
  })).describe('Chart data'),
  title: z.string().optional(),
  centerLabel: z.string().optional(),
  centerValue: z.string().optional(),
});

const DataTableSchema = z.object({
  headers: z.array(z.object({
    key: z.string(),
    label: z.string(),
    align: z.enum(['left', 'center', 'right']).optional(),
  })).describe('Column definitions'),
  rows: z.array(z.record(z.string(), z.string())).describe('Row data objects'),
  striped: z.boolean().optional(),
  compact: z.boolean().optional(),
  caption: z.string().optional(),
});

// Feedback components
const SpinnerSchema = z.object({
  size: z.enum(['xs', 'sm', 'md', 'lg']).optional(),
  label: z.string().optional(),
});

const RatingSchema = z.object({
  value: z.number().min(0).max(5).describe('Rating value (0-5)'),
  maxValue: z.number().optional(),
  label: z.string().optional(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
});

// Rich content components
const BlockquoteSchema = z.object({
  content: z.string().describe('Quote text'),
  author: z.string().optional(),
  source: z.string().optional(),
});

const MarkdownSchema = z.object({
  content: z.string().describe('Markdown content to render'),
});

const MetricRowSchema = z.object({
  metrics: z.array(z.object({
    label: z.string(),
    value: z.union([z.string(), z.number()]),
    change: z.number().optional(),
    trend: z.enum(['up', 'down', 'neutral']).optional(),
    icon: z.string().optional(),
  })).describe('Row of metrics to display'),
});

const AvatarGroupSchema = z.object({
  avatars: z.array(z.object({
    src: z.string().optional(),
    alt: z.string(),
    fallback: z.string().optional(),
  })).describe('Avatars to display'),
  max: z.number().optional().describe('Max avatars to show before +N'),
  size: z.enum(['xs', 'sm', 'md', 'lg']).optional(),
});

const CountdownSchema = z.object({
  targetDate: z.string().describe('ISO date string to count down to'),
  label: z.string().optional(),
  showDays: z.boolean().optional(),
  showHours: z.boolean().optional(),
  showMinutes: z.boolean().optional(),
  showSeconds: z.boolean().optional(),
});

const ToggleGroupSchema = z.object({
  options: z.array(z.object({
    label: z.string(),
    value: z.string(),
    icon: z.string().optional(),
  })).describe('Toggle options'),
  value: z.string().optional(),
  allowMultiple: z.boolean().optional(),
});

// ============================================================================
// DESIGN GALLERY / THEME COMPONENTS
// ============================================================================

const ColorSwatchSchema = z.object({
  color: z.string().describe('CSS color value (hex, hsl, or theme token like "primary")'),
  label: z.string().optional().describe('Color name'),
  size: z.enum(['sm', 'md', 'lg']).optional(),
  showHex: z.boolean().optional(),
});

const ColorPaletteSchema = z.object({
  colors: z.array(z.object({
    color: z.string().describe('CSS color value or theme token'),
    label: z.string(),
  })).describe('Array of colors to display'),
  title: z.string().optional(),
  layout: z.enum(['row', 'grid']).optional(),
});

const ThemeCardSchema2 = z.object({
  themeName: z.string().describe('Theme slug (e.g. "claude", "cyberpunk", "nike")'),
  headline: z.string().optional().describe('Theme headline'),
  tagline: z.string().optional(),
  font: z.string().optional().describe('Primary font name'),
  colors: z.object({
    primary: z.string().optional(),
    secondary: z.string().optional(),
    accent: z.string().optional(),
    background: z.string().optional(),
  }).optional().describe('Key theme colors'),
  showApplyButton: z.boolean().optional(),
});

const ThemeGridSchema = z.object({
  themes: z.array(z.object({
    themeName: z.string(),
    label: z.string(),
    headline: z.string().optional(),
    colors: z.object({
      primary: z.string().optional(),
      accent: z.string().optional(),
      background: z.string().optional(),
    }).optional(),
  })).describe('Themes to display in grid'),
  columns: z.number().min(1).max(4).optional(),
});

const ThemeShowcaseSchema = z.object({
  themeName: z.string().describe('Theme slug to showcase'),
  showColorTokens: z.boolean().optional(),
  showTypography: z.boolean().optional(),
  showComponents: z.boolean().optional(),
});

// Skeleton/Loading placeholder
const SkeletonSchema = z.object({
  variant: z.enum(['text', 'circular', 'rectangular', 'card']).optional(),
  width: z.union([z.number(), z.string()]).optional(),
  height: z.union([z.number(), z.string()]).optional(),
  count: z.number().optional().describe('Number of skeleton items'),
});

// ============================================================================
// ACTION SCHEMAS
// ============================================================================

const NavigateActionSchema = z.object({
  path: z.string().describe('Path to navigate to'),
});

const OpenUrlActionSchema = z.object({
  url: z.string().describe('URL to open'),
  newTab: z.boolean().optional(),
});

const ShowToastActionSchema = z.object({
  message: z.string().describe('Toast message'),
  variant: z.enum(['info', 'success', 'warning', 'error']).optional(),
});

const ApplyThemeActionSchema = z.object({
  themeName: z.string().describe('Theme slug to apply (e.g. "claude", "cyberpunk", "nike")'),
});

// ============================================================================
// CREATE CATALOG
// ============================================================================

export const openClawCatalog = createCatalog({
  name: 'claw-ai',
  components: {
    // Text
    text: {
      props: TextSchema,
      description: 'Display text with various styles',
    },
    heading: {
      props: HeadingSchema,
      description: 'Display a heading (h1-h4)',
    },

    // Layout
    card: {
      props: CardSchema,
      hasChildren: true,
      description: 'A card container for grouping content',
    },
    stack: {
      props: StackSchema,
      hasChildren: true,
      description: 'Stack items horizontally or vertically',
    },
    grid: {
      props: GridSchema,
      hasChildren: true,
      description: 'Grid layout for items',
    },
    divider: {
      props: DividerSchema,
      description: 'A visual divider line',
    },

    // Interactive
    button: {
      props: ButtonSchema,
      description: 'A clickable button',
    },
    link: {
      props: LinkSchema,
      description: 'A clickable link',
    },
    badge: {
      props: BadgeSchema,
      description: 'A small status indicator',
    },
    tag: {
      props: TagSchema,
      description: 'A tag/chip label',
    },

    // Data display
    statCard: {
      props: StatCardSchema,
      description: 'Display a statistic with optional trend',
    },
    progress: {
      props: ProgressSchema,
      description: 'A progress bar',
    },
    avatar: {
      props: AvatarSchema,
      description: 'Display a user avatar',
    },
    icon: {
      props: IconSchema,
      description: 'Display an icon',
    },

    // Lists
    list: {
      props: ListSchema,
      hasChildren: true,
      description: 'A list container',
    },
    listItem: {
      props: ListItemSchema,
      description: 'A list item',
    },

    // Media
    image: {
      props: ImageSchema,
      description: 'Display an image',
    },

    // Code
    codeBlock: {
      props: CodeBlockSchema,
      description: 'Display a code block with syntax highlighting',
    },
    inlineCode: {
      props: InlineCodeSchema,
      description: 'Inline code snippet',
    },

    // Alerts
    alert: {
      props: AlertSchema,
      description: 'An alert/notification message',
    },
    callout: {
      props: CalloutSchema,
      description: 'A callout box for important information',
    },

    // Table
    table: {
      props: TableSchema,
      description: 'Display tabular data',
    },

    // Key-value
    keyValue: {
      props: KeyValueSchema,
      description: 'Display a label-value pair',
    },
    keyValueList: {
      props: KeyValueListSchema,
      description: 'Display multiple key-value pairs',
    },

    // Timeline
    timeline: {
      props: TimelineSchema,
      hasChildren: true,
      description: 'A timeline container',
    },
    timelineItem: {
      props: TimelineItemSchema,
      description: 'A timeline event',
    },

    // Charts
    barChart: {
      props: SimpleBarChartSchema,
      description: 'A simple horizontal bar chart',
    },
    pieChart: {
      props: SimplePieChartSchema,
      description: 'A simple pie chart',
    },

    // Portfolio-specific
    weatherWidget: {
      props: WeatherWidgetSchema,
      description: 'Display weather information',
    },
    taskCard: {
      props: TaskCardSchema,
      description: 'Display a task/ticket card',
    },
    projectCard: {
      props: ProjectCardSchema,
      description: 'Display a project card',
    },
    workExperienceCard: {
      props: WorkExperienceCardSchema,
      description: 'Display work experience',
    },
    themePreviewCard: {
      props: ThemePreviewCardSchema,
      description: 'Preview a design theme',
    },
    photoGallery: {
      props: PhotoGallerySchema,
      description: 'Display a photo gallery',
    },
    skillBadge: {
      props: SkillBadgeSchema,
      description: 'Display a skill with level',
    },

    // Utility
    emptyState: {
      props: EmptyStateSchema,
      description: 'Empty state placeholder',
    },
    skeleton: {
      props: SkeletonSchema,
      description: 'Loading skeleton placeholder',
    },

    // Form components
    input: {
      props: InputSchema,
      description: 'A text input field with label and validation',
    },
    textarea: {
      props: TextareaSchema,
      description: 'A multi-line text input',
    },
    select: {
      props: SelectSchema,
      description: 'A dropdown select input with options',
    },
    checkbox: {
      props: CheckboxSchema,
      description: 'A checkbox toggle',
    },
    switch: {
      props: SwitchSchema,
      description: 'A toggle switch with label',
    },
    radioGroup: {
      props: RadioGroupSchema,
      description: 'A group of radio buttons for single selection',
    },
    slider: {
      props: SliderSchema,
      description: 'A range slider input',
    },
    form: {
      props: FormSchema,
      hasChildren: true,
      description: 'A form container for grouping inputs',
    },

    // Navigation components
    tabs: {
      props: TabsSchema,
      hasChildren: true,
      description: 'Tab container for organizing content into tabs',
    },
    tab: {
      props: TabSchema,
      description: 'A single tab label',
    },
    tabContent: {
      props: TabContentSchema,
      hasChildren: true,
      description: 'Content panel for a specific tab',
    },
    breadcrumb: {
      props: BreadcrumbSchema,
      description: 'A breadcrumb navigation trail',
    },
    pagination: {
      props: PaginationSchema,
      description: 'Page navigation controls',
    },
    stepper: {
      props: StepperSchema,
      description: 'A step-by-step progress indicator',
    },

    // Extended layout components
    accordion: {
      props: AccordionSchema,
      hasChildren: true,
      description: 'Collapsible sections container',
    },
    accordionItem: {
      props: AccordionItemSchema,
      hasChildren: true,
      description: 'A single collapsible section',
    },
    dialog: {
      props: DialogSchema,
      hasChildren: true,
      description: 'A modal dialog overlay',
    },
    drawer: {
      props: DrawerSchema,
      hasChildren: true,
      description: 'A slide-out panel from an edge',
    },
    tooltip: {
      props: TooltipSchema,
      hasChildren: true,
      description: 'A hover tooltip with text content',
    },
    separator: {
      props: SeparatorSchema,
      description: 'A labeled section separator',
    },

    // More data visualization
    lineChart: {
      props: LineChartSchema,
      description: 'A line chart with data points',
    },
    sparkline: {
      props: SparklineSchema,
      description: 'A compact inline sparkline chart',
    },
    donutChart: {
      props: DonutChartSchema,
      description: 'A donut/ring chart with center label',
    },
    dataTable: {
      props: DataTableSchema,
      description: 'A data table with structured column headers and typed rows',
    },

    // Feedback
    spinner: {
      props: SpinnerSchema,
      description: 'A loading spinner indicator',
    },
    rating: {
      props: RatingSchema,
      description: 'A star rating display',
    },

    // Rich content
    blockquote: {
      props: BlockquoteSchema,
      description: 'A styled quotation with attribution',
    },
    markdown: {
      props: MarkdownSchema,
      description: 'Render simple markdown content',
    },
    metricRow: {
      props: MetricRowSchema,
      description: 'A horizontal row of stat metrics',
    },
    avatarGroup: {
      props: AvatarGroupSchema,
      description: 'A group of overlapping avatars',
    },
    countdown: {
      props: CountdownSchema,
      description: 'A countdown timer to a target date',
    },
    toggleGroup: {
      props: ToggleGroupSchema,
      description: 'A group of toggle buttons for selection',
    },

    // Design Gallery / Theme components
    colorSwatch: {
      props: ColorSwatchSchema,
      description: 'A single color swatch with optional label',
    },
    colorPalette: {
      props: ColorPaletteSchema,
      description: 'A row or grid of color swatches',
    },
    designThemeCard: {
      props: ThemeCardSchema2,
      description: 'A card showcasing a design theme with colors, font, and apply button',
    },
    themeGrid: {
      props: ThemeGridSchema,
      description: 'A grid of theme preview cards',
    },
    themeShowcase: {
      props: ThemeShowcaseSchema,
      hasChildren: true,
      description: 'Full theme showcase with color tokens, typography, and sample components',
    },
  },
  actions: {
    navigate: {
      params: NavigateActionSchema,
      description: 'Navigate to a page',
    },
    openUrl: {
      params: OpenUrlActionSchema,
      description: 'Open a URL',
    },
    showToast: {
      params: ShowToastActionSchema,
      description: 'Show a toast notification',
    },
    applyTheme: {
      params: ApplyThemeActionSchema,
      description: 'Apply a design theme to the OS',
    },
  },
});

// Generate the prompt for 8gent to understand how to use the catalog
export const catalogPrompt = generateCatalogPrompt(openClawCatalog);

// Export types for use in renderers
export type OpenClawCatalog = typeof openClawCatalog;
export type ComponentType = keyof typeof openClawCatalog.components;
