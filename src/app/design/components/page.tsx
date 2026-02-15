'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Layout,
  Type,
  FormInput,
  Bell,
  Table,
  Navigation,
  Layers,
  Image as ImageIcon,
  MousePointerClick,
  ChevronRight,
  Copy,
  Check,
  Code,
  X,
} from 'lucide-react';
import { useDesignTheme } from '@/context/DesignThemeContext';
import { useTheme } from 'next-themes';
import '@/lib/themes/themes.css';
import { FadeIn, FadeInUp, AnimatedGroup, TextEffect } from '@/components/motion';
import { PageTransition } from '@/components/ios';
import { DesignNavigation } from '@/components/design/DesignNavigation';

// Component categories with their components
const COMPONENT_CATEGORIES = [
  {
    id: 'layout',
    name: 'Layout',
    icon: Layout,
    description: 'Structural components for page layout',
    components: [
      { name: 'Container', description: 'Responsive container with max-width constraints' },
      { name: 'Stack', description: 'Vertical/horizontal flex layout (VStack, HStack)' },
      { name: 'Grid', description: 'CSS Grid layout with responsive columns' },
      { name: 'Flex', description: 'Flexible box layout with alignment controls' },
      { name: 'Section', description: 'Semantic section with spacing variants' },
      { name: 'Box', description: 'Generic container with style props' },
      { name: 'AspectRatio', description: 'Maintains aspect ratio of children' },
      { name: 'Center', description: 'Centers content horizontally and vertically' },
      { name: 'Spacer', description: 'Flexible space between elements' },
      { name: 'Divider', description: 'Visual separator with label support' },
    ],
  },
  {
    id: 'typography',
    name: 'Typography',
    icon: Type,
    description: 'Text and content display components',
    components: [
      { name: 'Heading', description: 'Semantic headings h1-h6 with size variants' },
      { name: 'Text', description: 'General text with size, weight, color variants' },
      { name: 'Paragraph', description: 'Block text with leading and spacing' },
      { name: 'Code', description: 'Inline and block code with syntax styling' },
      { name: 'Blockquote', description: 'Quoted text with citation support' },
      { name: 'List', description: 'Ordered and unordered lists with styling' },
      { name: 'Label', description: 'Form labels with required indicator' },
      { name: 'Highlight', description: 'Highlighted text with color variants' },
    ],
  },
  {
    id: 'form',
    name: 'Form',
    icon: FormInput,
    description: 'Form inputs and controls',
    components: [
      { name: 'Input', description: 'Text input with variants and states' },
      { name: 'Textarea', description: 'Multi-line text input with auto-resize' },
      { name: 'Select', description: 'Dropdown select with search support' },
      { name: 'Checkbox', description: 'Checkbox with indeterminate state' },
      { name: 'Radio', description: 'Radio button with RadioGroup container' },
      { name: 'Switch', description: 'Toggle switch with size variants' },
      { name: 'Slider', description: 'Range slider with marks and tooltips' },
      { name: 'FormField', description: 'Field wrapper with label, error, hint' },
      { name: 'FormGroup', description: 'Groups related form fields' },
    ],
  },
  {
    id: 'feedback',
    name: 'Feedback',
    icon: Bell,
    description: 'User feedback and status components',
    components: [
      { name: 'Alert', description: 'Contextual alerts with icon and actions' },
      { name: 'Toast', description: 'Temporary notifications with auto-dismiss' },
      { name: 'Progress', description: 'Linear progress with percentage' },
      { name: 'Spinner', description: 'Loading spinner with size variants' },
      { name: 'Skeleton', description: 'Content placeholder with shimmer effect' },
      { name: 'EmptyState', description: 'Empty content placeholder with action' },
      { name: 'Banner', description: 'Full-width notification banner' },
    ],
  },
  {
    id: 'data-display',
    name: 'Data Display',
    icon: Table,
    description: 'Components for displaying data',
    components: [
      { name: 'DataTable', description: 'Sortable, filterable data table' },
      { name: 'Stat', description: 'Statistic display with trend indicator' },
      { name: 'Timeline', description: 'Vertical timeline with events' },
      { name: 'Calendar', description: 'Date calendar with event support' },
      { name: 'Tag', description: 'Categorization tag with removal' },
      { name: 'Chip', description: 'Compact element with avatar support' },
      { name: 'KeyValue', description: 'Key-value pair display list' },
    ],
  },
  {
    id: 'navigation',
    name: 'Navigation',
    icon: Navigation,
    description: 'Navigation and wayfinding components',
    components: [
      { name: 'Breadcrumb', description: 'Navigation breadcrumbs with separator' },
      { name: 'Tabs', description: 'Tab navigation with content panels' },
      { name: 'Pagination', description: 'Page navigation with page size' },
      { name: 'Menu', description: 'Vertical menu with nested items' },
      { name: 'NavLink', description: 'Navigation link with active state' },
      { name: 'Stepper', description: 'Multi-step progress indicator' },
    ],
  },
  {
    id: 'overlay',
    name: 'Overlay',
    icon: Layers,
    description: 'Overlays and modals',
    components: [
      { name: 'Modal', description: 'Centered modal with header, body, footer' },
      { name: 'Drawer', description: 'Slide-in panel from edge' },
      { name: 'Popover', description: 'Positioned popover with arrow' },
      { name: 'Dialog', description: 'Confirmation dialog with actions' },
      { name: 'Sheet', description: 'Bottom sheet for mobile' },
      { name: 'Dropdown', description: 'Dropdown menu with items' },
    ],
  },
  {
    id: 'media',
    name: 'Media',
    icon: ImageIcon,
    description: 'Media display components',
    components: [
      { name: 'Image', description: 'Optimized image with fallback' },
      { name: 'Video', description: 'Video player with controls' },
      { name: 'Carousel', description: 'Image/content carousel with navigation' },
      { name: 'Gallery', description: 'Image gallery with lightbox' },
    ],
  },
  {
    id: 'interactive',
    name: 'Interactive',
    icon: MousePointerClick,
    description: 'Interactive UI elements',
    components: [
      { name: 'Accordion', description: 'Expandable content sections' },
      { name: 'Collapsible', description: 'Single collapsible section' },
      { name: 'DragHandle', description: 'Draggable item indicator' },
      { name: 'Resizable', description: 'Resizable panels with handle' },
    ],
  },
];

// Count total components
const TOTAL_COMPONENTS = COMPONENT_CATEGORIES.reduce(
  (acc, cat) => acc + cat.components.length,
  0
);

export default function ComponentsPage() {
  const { designTheme } = useDesignTheme();
  const { resolvedTheme: siteTheme } = useTheme();
  const isDarkMode = siteTheme === 'dark';
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copiedComponent, setCopiedComponent] = useState<string | null>(null);

  // Filter components based on search
  const filteredCategories = COMPONENT_CATEGORIES.map((category) => ({
    ...category,
    components: category.components.filter(
      (comp) =>
        comp.name.toLowerCase().includes(search.toLowerCase()) ||
        comp.description.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((category) => category.components.length > 0);

  const handleCopyImport = (componentName: string) => {
    const importStatement = `import { ${componentName} } from '@/components/superdesign';`;
    navigator.clipboard.writeText(importStatement);
    setCopiedComponent(componentName);
    setTimeout(() => setCopiedComponent(null), 2000);
  };

  return (
    <PageTransition>
      <div
        data-design-theme={designTheme}
        className="min-h-screen transition-all duration-500"
        style={{
          backgroundColor: 'hsl(var(--theme-background))',
          color: 'hsl(var(--theme-foreground))',
          fontFamily: 'var(--theme-font)',
        }}
      >
        {/* Navigation */}
        <DesignNavigation />

        {/* Hero + Search + Filters */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-6">
            <div>
              <FadeIn delay={0.1}>
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
                  <span
                    className="text-xs font-medium tracking-wider uppercase"
                    style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                  >
                    Component Library
                  </span>
                </div>
              </FadeIn>

              <TextEffect per="word" preset="blur" as="h1" className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
                SuperDesign
              </TextEffect>

              <FadeInUp delay={0.2}>
                <p className="text-sm max-w-lg" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  {TOTAL_COMPONENTS} production-ready components across {COMPONENT_CATEGORIES.length} categories.
                </p>
              </FadeInUp>
            </div>

            {/* Search */}
            <FadeInUp delay={0.3}>
              <div className="relative w-full md:w-64">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search components..."
                  className="w-full pl-9 pr-9 py-2 rounded-lg border text-sm outline-none transition-all focus:ring-2"
                  style={{
                    borderColor: 'hsl(var(--theme-border))',
                    backgroundColor: 'hsl(var(--theme-card))',
                    color: 'hsl(var(--theme-foreground))',
                  }}
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </FadeInUp>
          </div>

          {/* Category Pills */}
          <FadeInUp delay={0.35}>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                style={{
                  backgroundColor: selectedCategory === null
                    ? 'hsl(var(--theme-primary))'
                    : 'hsl(var(--theme-muted) / 0.5)',
                  color: selectedCategory === null
                    ? 'hsl(var(--theme-primary-foreground))'
                    : 'hsl(var(--theme-muted-foreground))',
                }}
              >
                <Layers className="w-3.5 h-3.5" />
                All
                <span className="text-xs opacity-70">{TOTAL_COMPONENTS}</span>
              </button>
              {COMPONENT_CATEGORIES.map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;
                const componentCount = category.components.length;
                const filteredCount = filteredCategories.find((c) => c.id === category.id)?.components.length || 0;

                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(isActive ? null : category.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                    style={{
                      backgroundColor: isActive
                        ? 'hsl(var(--theme-primary))'
                        : 'hsl(var(--theme-muted) / 0.5)',
                      color: isActive
                        ? 'hsl(var(--theme-primary-foreground))'
                        : 'hsl(var(--theme-muted-foreground))',
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {category.name}
                    <span className="text-xs opacity-70">
                      {search ? filteredCount : componentCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </FadeInUp>
        </section>

        {/* Component List */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <AnimatePresence mode="wait">
            {filteredCategories
              .filter((cat) => !selectedCategory || cat.id === selectedCategory)
              .map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-12"
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <category.icon className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
                    <h2 className="text-2xl font-bold">{category.name}</h2>
                    <span
                      className="text-sm px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: 'hsl(var(--theme-secondary))',
                        color: 'hsl(var(--theme-secondary-foreground))',
                      }}
                    >
                      {category.components.length} components
                    </span>
                  </div>
                  <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                    {category.description}
                  </p>

                  {/* Component Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.components.map((component) => (
                      <motion.div
                        key={component.name}
                        whileHover={{ scale: 1.02 }}
                        className="group relative p-4 rounded-xl border transition-all hover:shadow-lg"
                        style={{
                          borderColor: 'hsl(var(--theme-border))',
                          backgroundColor: 'hsl(var(--theme-card))',
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold">{component.name}</h3>
                          <button
                            onClick={() => handleCopyImport(component.name)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all"
                            style={{
                              backgroundColor: 'hsl(var(--theme-secondary))',
                            }}
                            title="Copy import statement"
                          >
                            {copiedComponent === component.name ? (
                              <Check className="w-3.5 h-3.5" style={{ color: 'hsl(var(--theme-primary))' }} />
                            ) : (
                              <Copy className="w-3.5 h-3.5" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
                            )}
                          </button>
                        </div>
                        <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                          {component.description}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <code
                            className="text-xs px-2 py-1 rounded"
                            style={{
                              backgroundColor: 'hsl(var(--theme-secondary))',
                              color: 'hsl(var(--theme-secondary-foreground))',
                            }}
                          >
                            {`<${component.name} />`}
                          </code>
                          <ChevronRight
                            className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: 'hsl(var(--theme-primary))' }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>

          {/* No Results */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-20">
              <Search className="w-12 h-12 mx-auto mb-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
              <h3 className="text-lg font-medium mb-2">No components found</h3>
              <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                Try a different search term
              </p>
              <button
                onClick={() => setSearch('')}
                className="mt-4 px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: 'hsl(var(--theme-primary))',
                  color: 'hsl(var(--theme-primary-foreground))',
                }}
              >
                Clear search
              </button>
            </div>
          )}
        </section>

        {/* Installation Section */}
        <section
          className="border-t py-16"
          style={{ borderColor: 'hsl(var(--theme-border))' }}
        >
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold mb-6">Quick Start</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div
                className="p-6 rounded-xl border"
                style={{
                  borderColor: 'hsl(var(--theme-border))',
                  backgroundColor: 'hsl(var(--theme-card))',
                }}
              >
                <h3 className="font-semibold mb-3">Import Components</h3>
                <code
                  className="block text-sm p-3 rounded-lg overflow-x-auto"
                  style={{
                    backgroundColor: 'hsl(var(--theme-secondary))',
                    color: 'hsl(var(--theme-secondary-foreground))',
                  }}
                >
                  {`import { Button, Card, Modal } from '@/components/superdesign';`}
                </code>
              </div>
              <div
                className="p-6 rounded-xl border"
                style={{
                  borderColor: 'hsl(var(--theme-border))',
                  backgroundColor: 'hsl(var(--theme-card))',
                }}
              >
                <h3 className="font-semibold mb-3">Use with Theme</h3>
                <code
                  className="block text-sm p-3 rounded-lg overflow-x-auto"
                  style={{
                    backgroundColor: 'hsl(var(--theme-secondary))',
                    color: 'hsl(var(--theme-secondary-foreground))',
                  }}
                >
                  {`<Container size="lg">
  <Heading level={1}>Hello</Heading>
  <Text muted>Welcome to SuperDesign</Text>
</Container>`}
                </code>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-8" style={{ borderColor: 'hsl(var(--theme-border))' }}>
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              Components inspired by{' '}
              <a
                href="https://superdesign.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
                style={{ color: 'hsl(var(--theme-primary))' }}
              >
                SuperDesign
              </a>
            </p>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}
