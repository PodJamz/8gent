/**
 * Claw AI Component Registry for json-render
 *
 * Maps catalog component types to actual React components.
 * All components receive props through ComponentRenderProps.
 */

'use client';

import type { ComponentRegistry, ComponentRenderProps } from '@json-render/react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { themes as allDesignThemes, getThemeLabel, isValidTheme } from '@/lib/themes/definitions';
import {
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Snowflake,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  X,
  Check,
  AlertCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  ChevronRight,
  Star,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

// Get a Lucide icon by name
function getIcon(name: string): LucideIcon | null {
  const iconName = name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const icons = LucideIcons as unknown as Record<string, LucideIcon>;
  return icons[iconName] || null;
}

// Gap class mapping
const gapClasses = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

// Size class mapping for icons
const iconSizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

// ============================================================================
// TEXT COMPONENTS
// ============================================================================

function TextComponent({ element }: ComponentRenderProps) {
  const { content, variant = 'body', className } = element.props as {
    content: string;
    variant?: 'body' | 'heading' | 'subheading' | 'caption' | 'code';
    className?: string;
  };

  const variantClasses = {
    body: 'text-sm text-white/80',
    heading: 'text-lg font-semibold text-white',
    subheading: 'text-base font-medium text-white/90',
    caption: 'text-xs text-white/50',
    code: 'font-mono text-sm text-amber-400 bg-white/5 px-1 rounded',
  };

  return <p className={cn(variantClasses[variant], className)}>{content}</p>;
}

function HeadingComponent({ element }: ComponentRenderProps) {
  const { content, level = 'h2' } = element.props as {
    content: string;
    level?: 'h1' | 'h2' | 'h3' | 'h4';
  };

  const levelClasses = {
    h1: 'text-2xl font-bold text-white',
    h2: 'text-xl font-semibold text-white',
    h3: 'text-lg font-medium text-white',
    h4: 'text-base font-medium text-white/90',
  };

  const Tag = level;
  return <Tag className={levelClasses[level]}>{content}</Tag>;
}

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

function CardComponent({ element, children }: ComponentRenderProps) {
  const { title, description, variant = 'default' } = element.props as {
    title?: string;
    description?: string;
    variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  };

  const variantClasses = {
    default: 'bg-white/5 border border-white/10',
    elevated: 'bg-white/10 border border-white/20 shadow-lg',
    outlined: 'bg-transparent border-2 border-white/20',
    ghost: 'bg-transparent',
  };

  return (
    <div className={cn('rounded-xl p-4', variantClasses[variant])}>
      {title && <h3 className="text-base font-semibold text-white mb-1">{title}</h3>}
      {description && <p className="text-sm text-white/60 mb-3">{description}</p>}
      {children}
    </div>
  );
}

function StackComponent({ element, children }: ComponentRenderProps) {
  const {
    direction = 'vertical',
    gap = 'md',
    align = 'stretch',
    justify = 'start',
  } = element.props as {
    direction?: 'horizontal' | 'vertical';
    gap?: keyof typeof gapClasses;
    align?: 'start' | 'center' | 'end' | 'stretch';
    justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  return (
    <div
      className={cn(
        'flex',
        direction === 'horizontal' ? 'flex-row' : 'flex-col',
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify]
      )}
    >
      {children}
    </div>
  );
}

function GridComponent({ element, children }: ComponentRenderProps) {
  const { columns = 2, gap = 'md' } = element.props as {
    columns?: number;
    gap?: keyof typeof gapClasses;
  };

  const columnClasses: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  return <div className={cn('grid', columnClasses[columns] || 'grid-cols-2', gapClasses[gap])}>{children}</div>;
}

function DividerComponent({ element }: ComponentRenderProps) {
  const { orientation = 'horizontal' } = element.props as {
    orientation?: 'horizontal' | 'vertical';
  };

  return (
    <div
      className={cn(
        'bg-white/10',
        orientation === 'horizontal' ? 'h-px w-full my-2' : 'w-px h-full mx-2'
      )}
    />
  );
}

// ============================================================================
// INTERACTIVE COMPONENTS
// ============================================================================

function ButtonComponent({ element }: ComponentRenderProps) {
  const { label, variant = 'primary', size = 'md', disabled, icon, href } = element.props as {
    label: string;
    variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    icon?: string;
    href?: string;
  };

  // Primary variant uses theme accent color for brand coherence
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: 'hsl(var(--theme-primary))', color: 'hsl(var(--theme-primary-foreground))' },
  };

  const variantClasses = {
    primary: 'hover:opacity-90',
    secondary: 'bg-white/10 hover:bg-white/20 text-white',
    ghost: 'bg-transparent hover:bg-white/10 text-white',
    destructive: 'bg-red-500 hover:bg-red-600 text-white',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const Icon = icon ? getIcon(icon) : null;

  const buttonContent = (
    <>
      {Icon && <Icon className={iconSizeClasses[size === 'lg' ? 'md' : 'sm']} />}
      {label}
    </>
  );

  const className = cn(
    'rounded-lg font-medium transition-colors inline-flex items-center gap-1.5',
    variantClasses[variant],
    sizeClasses[size],
    disabled && 'opacity-50 cursor-not-allowed'
  );

  // If href is provided, render as a link
  if (href) {
    return (
      <Link href={href} className={className} style={variantStyles[variant]}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      className={className}
      style={variantStyles[variant]}
      disabled={disabled}
    >
      {buttonContent}
    </button>
  );
}

function LinkComponent({ element }: ComponentRenderProps) {
  const { label, href, external } = element.props as {
    label: string;
    href: string;
    external?: boolean;
  };

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 text-sm"
      >
        {label}
        <ExternalLink className="w-3 h-3" />
      </a>
    );
  }

  return (
    <Link href={href} className="text-amber-400 hover:text-amber-300 text-sm">
      {label}
    </Link>
  );
}

function BadgeComponent({ element }: ComponentRenderProps) {
  const { label, variant = 'default' } = element.props as {
    label: string;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  };

  const variantClasses = {
    default: 'bg-white/10 text-white/80',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    error: 'bg-red-500/20 text-red-400',
    info: 'bg-blue-500/20 text-blue-400',
  };

  return (
    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', variantClasses[variant])}>
      {label}
    </span>
  );
}

function TagComponent({ element }: ComponentRenderProps) {
  const { label, color, removable } = element.props as {
    label: string;
    color?: string;
    removable?: boolean;
  };

  return (
    <span
      className="px-2 py-0.5 rounded text-xs font-medium bg-white/10 text-white/80 inline-flex items-center gap-1"
      style={color ? { backgroundColor: `${color}20`, color } : undefined}
    >
      {label}
      {removable && <X className="w-3 h-3 cursor-pointer hover:opacity-70" />}
    </span>
  );
}

// ============================================================================
// DATA DISPLAY COMPONENTS
// ============================================================================

function StatCardComponent({ element }: ComponentRenderProps) {
  const { label, value, change, trend = 'neutral', icon } = element.props as {
    label: string;
    value: string | number;
    change?: number;
    trend?: 'up' | 'down' | 'neutral';
    icon?: string;
  };

  const Icon = icon ? getIcon(icon) : null;
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-white/50';

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-start justify-between">
        <p className="text-xs text-white/50 uppercase tracking-wider">{label}</p>
        {Icon && <Icon className="w-4 h-4 text-white/30" />}
      </div>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      {change !== undefined && (
        <div className={cn('flex items-center gap-1 mt-1 text-xs', trendColor)}>
          <TrendIcon className="w-3 h-3" />
          <span>{Math.abs(change)}%</span>
        </div>
      )}
    </div>
  );
}

function ProgressComponent({ element }: ComponentRenderProps) {
  const { value, label, showValue, variant = 'default' } = element.props as {
    value: number;
    label?: string;
    showValue?: boolean;
    variant?: 'default' | 'success' | 'warning' | 'error';
  };

  const variantClasses = {
    default: 'bg-amber-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  return (
    <div className="space-y-1">
      {(label || showValue) && (
        <div className="flex justify-between text-xs text-white/60">
          {label && <span>{label}</span>}
          {showValue && <span>{value}%</span>}
        </div>
      )}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', variantClasses[variant])}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}

function AvatarComponent({ element }: ComponentRenderProps) {
  const { src, alt, fallback, size = 'md' } = element.props as {
    src?: string;
    alt: string;
    fallback?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  if (src) {
    return (
      <div className={cn('rounded-full overflow-hidden bg-white/10', sizeClasses[size])}>
        <Image src={src} alt={alt} width={64} height={64} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-medium',
        sizeClasses[size]
      )}
    >
      {fallback || alt.charAt(0).toUpperCase()}
    </div>
  );
}

function IconComponent({ element }: ComponentRenderProps) {
  const { name, size = 'md', color } = element.props as {
    name: string;
    size?: keyof typeof iconSizeClasses;
    color?: string;
  };

  const Icon = getIcon(name);
  if (!Icon) return null;

  return <Icon className={cn(iconSizeClasses[size], 'text-white/60')} style={color ? { color } : undefined} />;
}

// ============================================================================
// LIST COMPONENTS
// ============================================================================

function ListComponent({ element, children }: ComponentRenderProps) {
  const { variant = 'unordered' } = element.props as {
    variant?: 'unordered' | 'ordered' | 'none';
  };

  if (variant === 'ordered') {
    return <ol className="space-y-1 list-decimal list-inside text-white/80 text-sm">{children}</ol>;
  }

  return <ul className={cn('space-y-1 text-white/80 text-sm', variant !== 'none' && 'list-disc list-inside')}>{children}</ul>;
}

function ListItemComponent({ element }: ComponentRenderProps) {
  const { content, icon } = element.props as {
    content: string;
    icon?: string;
  };

  const Icon = icon ? getIcon(icon) : null;

  if (Icon) {
    return (
      <li className="flex items-start gap-2">
        <Icon className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
        <span>{content}</span>
      </li>
    );
  }

  return <li>{content}</li>;
}

// ============================================================================
// MEDIA COMPONENTS
// ============================================================================

function ImageComponent({ element }: ComponentRenderProps) {
  const { src, alt, width, height, caption } = element.props as {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    caption?: string;
  };

  return (
    <figure className="space-y-2">
      <div className="rounded-lg overflow-hidden bg-white/5">
        <Image
          src={src}
          alt={alt}
          width={width || 400}
          height={height || 300}
          className="w-full h-auto object-cover"
        />
      </div>
      {caption && <figcaption className="text-xs text-white/50 text-center">{caption}</figcaption>}
    </figure>
  );
}

// ============================================================================
// CODE COMPONENTS
// ============================================================================

function CodeBlockComponent({ element }: ComponentRenderProps) {
  const { code, language, showLineNumbers, title } = element.props as {
    code: string;
    language?: string;
    showLineNumbers?: boolean;
    title?: string;
  };

  const lines = code.split('\n');

  return (
    <div className="rounded-lg bg-black/30 border border-white/10 overflow-hidden">
      {(title || language) && (
        <div className="px-3 py-1.5 bg-white/5 border-b border-white/10 flex items-center justify-between">
          {title && <span className="text-xs text-white/60">{title}</span>}
          {language && <span className="text-xs text-white/40">{language}</span>}
        </div>
      )}
      <pre className="p-3 overflow-x-auto text-sm">
        <code className="text-white/80 font-mono">
          {showLineNumbers
            ? lines.map((line, i) => (
                <div key={i} className="flex">
                  <span className="text-white/30 select-none w-8 text-right pr-4">{i + 1}</span>
                  <span>{line}</span>
                </div>
              ))
            : code}
        </code>
      </pre>
    </div>
  );
}

function InlineCodeComponent({ element }: ComponentRenderProps) {
  const { code } = element.props as { code: string };
  return <code className="font-mono text-sm text-amber-400 bg-white/5 px-1.5 py-0.5 rounded">{code}</code>;
}

// ============================================================================
// ALERT COMPONENTS
// ============================================================================

function AlertComponent({ element }: ComponentRenderProps) {
  const { title, message, variant = 'info', dismissible } = element.props as {
    title?: string;
    message: string;
    variant?: 'info' | 'success' | 'warning' | 'error';
    dismissible?: boolean;
  };

  const variantConfig = {
    info: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: Info, color: 'text-blue-400' },
    success: { bg: 'bg-green-500/10', border: 'border-green-500/30', icon: Check, color: 'text-green-400' },
    warning: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: AlertTriangle, color: 'text-yellow-400' },
    error: { bg: 'bg-red-500/10', border: 'border-red-500/30', icon: AlertCircle, color: 'text-red-400' },
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div className={cn('rounded-lg p-3 border flex gap-3', config.bg, config.border)}>
      <Icon className={cn('w-5 h-5 shrink-0', config.color)} />
      <div className="flex-1 min-w-0">
        {title && <p className={cn('font-medium text-sm', config.color)}>{title}</p>}
        <p className="text-sm text-white/70">{message}</p>
      </div>
      {dismissible && (
        <button className="shrink-0 text-white/40 hover:text-white/60">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function CalloutComponent({ element }: ComponentRenderProps) {
  const { title, content, variant = 'note', icon: customIcon } = element.props as {
    title?: string;
    content: string;
    variant?: 'note' | 'tip' | 'important' | 'warning' | 'caution';
    icon?: string;
  };

  const variantConfig = {
    note: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: Info, color: 'text-blue-400' },
    tip: { bg: 'bg-green-500/10', border: 'border-green-500/30', icon: Lightbulb, color: 'text-green-400' },
    important: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: AlertCircle, color: 'text-purple-400' },
    warning: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: AlertTriangle, color: 'text-yellow-400' },
    caution: { bg: 'bg-red-500/10', border: 'border-red-500/30', icon: AlertCircle, color: 'text-red-400' },
  };

  const config = variantConfig[variant];
  const Icon = customIcon ? getIcon(customIcon) || config.icon : config.icon;

  return (
    <div className={cn('rounded-lg p-3 border-l-4', config.bg, config.border)}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={cn('w-4 h-4', config.color)} />
        {title && <span className={cn('font-medium text-sm', config.color)}>{title}</span>}
      </div>
      <p className="text-sm text-white/70">{content}</p>
    </div>
  );
}

// ============================================================================
// TABLE COMPONENT
// ============================================================================

function TableComponent({ element }: ComponentRenderProps) {
  const { headers, rows, caption } = element.props as {
    headers: string[];
    rows: string[][];
    caption?: string;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        {caption && <caption className="text-xs text-white/50 mb-2">{caption}</caption>}
        <thead>
          <tr className="border-b border-white/10">
            {headers.map((header, i) => (
              <th key={i} className="px-3 py-2 text-left text-xs text-white/50 font-medium uppercase">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/5">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 text-white/80">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// KEY-VALUE COMPONENTS
// ============================================================================

function KeyValueComponent({ element }: ComponentRenderProps) {
  const { label, value } = element.props as { label: string; value: string };

  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-xs text-white/50">{label}</span>
      <span className="text-sm text-white/80">{value}</span>
    </div>
  );
}

function KeyValueListComponent({ element }: ComponentRenderProps) {
  const { items, layout = 'vertical' } = element.props as {
    items: Array<{ label: string; value: string }>;
    layout?: 'horizontal' | 'vertical' | 'grid';
  };

  const layoutClasses = {
    horizontal: 'flex flex-wrap gap-4',
    vertical: 'space-y-2',
    grid: 'grid grid-cols-2 gap-3',
  };

  return (
    <div className={layoutClasses[layout]}>
      {items.map((item, i) => (
        <div key={i} className={layout === 'horizontal' ? 'flex items-center gap-2' : ''}>
          <span className="text-xs text-white/50">{item.label}:</span>
          <span className="text-sm text-white/80">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// TIMELINE COMPONENTS
// ============================================================================

function TimelineComponent({ element, children }: ComponentRenderProps) {
  const { variant = 'default' } = element.props as {
    variant?: 'default' | 'compact';
  };

  return (
    <div className={cn('relative pl-6', variant === 'compact' ? 'space-y-2' : 'space-y-4')}>
      <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-white/10" />
      {children}
    </div>
  );
}

function TimelineItemComponent({ element }: ComponentRenderProps) {
  const { title, description, date, status = 'upcoming', icon } = element.props as {
    title: string;
    description?: string;
    date?: string;
    status?: 'completed' | 'current' | 'upcoming';
    icon?: string;
  };

  const statusConfig = {
    completed: { bg: 'bg-green-500', ring: 'ring-green-500/30' },
    current: { bg: 'bg-amber-500', ring: 'ring-amber-500/30' },
    upcoming: { bg: 'bg-white/30', ring: 'ring-white/10' },
  };

  const config = statusConfig[status];
  const Icon = icon ? getIcon(icon) : null;

  return (
    <div className="relative">
      <div
        className={cn(
          'absolute -left-6 top-1 w-4 h-4 rounded-full ring-4 flex items-center justify-center',
          config.bg,
          config.ring
        )}
      >
        {Icon && <Icon className="w-2.5 h-2.5 text-white" />}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-white">{title}</h4>
          {date && <span className="text-xs text-white/40">{date}</span>}
        </div>
        {description && <p className="text-xs text-white/60 mt-0.5">{description}</p>}
      </div>
    </div>
  );
}

// ============================================================================
// CHART COMPONENTS
// ============================================================================

function BarChartComponent({ element }: ComponentRenderProps) {
  const { data, title, showValues, maxValue } = element.props as {
    data: Array<{ label: string; value: number; color?: string }>;
    title?: string;
    showValues?: boolean;
    maxValue?: number;
  };

  const max = maxValue || Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-3">
      {title && <h4 className="text-sm font-medium text-white">{title}</h4>}
      <div className="space-y-2">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs text-white/50 w-20 truncate">{item.label}</span>
            <div className="flex-1 h-5 bg-white/5 rounded overflow-hidden">
              <div
                className="h-full rounded transition-all"
                style={{
                  width: `${(item.value / max) * 100}%`,
                  backgroundColor: item.color || '#f59e0b',
                }}
              />
            </div>
            {showValues && <span className="text-xs text-white/60 w-10 text-right">{item.value}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function PieChartComponent({ element }: ComponentRenderProps) {
  const { data, title, showLegend } = element.props as {
    data: Array<{ label: string; value: number; color?: string }>;
    title?: string;
    showLegend?: boolean;
  };

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const defaultColors = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4'];

  // Calculate segments for the pie chart (using CSS conic-gradient)
  let currentAngle = 0;
  const segments = data.map((d, i) => {
    const angle = (d.value / total) * 360;
    const segment = {
      ...d,
      color: d.color || defaultColors[i % defaultColors.length],
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
    };
    currentAngle += angle;
    return segment;
  });

  const gradient = segments
    .map((s) => `${s.color} ${s.startAngle}deg ${s.endAngle}deg`)
    .join(', ');

  return (
    <div className="space-y-3">
      {title && <h4 className="text-sm font-medium text-white text-center">{title}</h4>}
      <div className="flex items-center justify-center gap-6">
        <div
          className="w-24 h-24 rounded-full"
          style={{ background: `conic-gradient(${gradient})` }}
        />
        {showLegend && (
          <div className="space-y-1">
            {segments.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: s.color }} />
                <span className="text-xs text-white/60">{s.label}</span>
                <span className="text-xs text-white/40">({Math.round((s.value / total) * 100)}%)</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// PORTFOLIO-SPECIFIC COMPONENTS
// ============================================================================

function WeatherWidgetComponent({ element }: ComponentRenderProps) {
  const { location, temperature, condition, humidity, windSpeed } = element.props as {
    location: string;
    temperature: number;
    condition: 'sunny' | 'cloudy' | 'rainy' | 'windy' | 'snowy';
    humidity?: number;
    windSpeed?: number;
  };

  const conditionIcons = {
    sunny: Sun,
    cloudy: Cloud,
    rainy: CloudRain,
    windy: Wind,
    snowy: Snowflake,
  };

  const Icon = conditionIcons[condition];

  return (
    <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-white/10">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-white/50">{location}</p>
          <p className="text-3xl font-bold text-white">{temperature}°F</p>
          <p className="text-sm text-white/60 capitalize">{condition}</p>
        </div>
        <Icon className="w-12 h-12 text-white/40" />
      </div>
      {(humidity !== undefined || windSpeed !== undefined) && (
        <div className="flex gap-4 mt-3 pt-3 border-t border-white/10">
          {humidity !== undefined && (
            <div className="text-xs text-white/50">
              Humidity: <span className="text-white/80">{humidity}%</span>
            </div>
          )}
          {windSpeed !== undefined && (
            <div className="text-xs text-white/50">
              Wind: <span className="text-white/80">{windSpeed} mph</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TaskCardComponent({ element }: ComponentRenderProps) {
  const { title, description, status, priority = 'medium', tags, assignee, dueDate } = element.props as {
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'done' | 'backlog';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    tags?: string[];
    assignee?: string;
    dueDate?: string;
  };

  const statusColors = {
    todo: 'bg-gray-500',
    'in-progress': 'bg-blue-500',
    done: 'bg-green-500',
    backlog: 'bg-purple-500',
  };

  const priorityColors = {
    low: 'text-gray-400',
    medium: 'text-yellow-400',
    high: 'text-orange-400',
    urgent: 'text-red-400',
  };

  return (
    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
      <div className="flex items-start gap-2">
        <div className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', statusColors[status])} />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-white truncate">{title}</h4>
          {description && <p className="text-xs text-white/50 mt-0.5 line-clamp-2">{description}</p>}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map((tag, i) => (
                <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs">
            <span className={priorityColors[priority]}>{priority}</span>
            {assignee && <span className="text-white/40">{assignee}</span>}
            {dueDate && <span className="text-white/40">{dueDate}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCardComponent({ element }: ComponentRenderProps) {
  const { title, description, technologies, url, image } = element.props as {
    title: string;
    description?: string;
    technologies?: string[];
    url?: string;
    image?: string;
  };

  return (
    <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
      {image && (
        <div className="aspect-video bg-white/5">
          <Image src={image} alt={title} width={400} height={225} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4">
        <h4 className="text-base font-semibold text-white">{title}</h4>
        {description && <p className="text-sm text-white/60 mt-1">{description}</p>}
        {technologies && technologies.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {technologies.map((tech, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                {tech}
              </span>
            ))}
          </div>
        )}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-3 text-sm text-amber-400 hover:text-amber-300"
          >
            View project <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}

function WorkExperienceCardComponent({ element }: ComponentRenderProps) {
  const { company, role, period, description, technologies, logo } = element.props as {
    company: string;
    role: string;
    period: string;
    description?: string;
    technologies?: string[];
    logo?: string;
  };

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-start gap-3">
        {logo ? (
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10 shrink-0">
            <Image src={logo} alt={company} width={40} height={40} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
            <span className="text-amber-400 font-bold">{company.charAt(0)}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-semibold text-white">{role}</h4>
          <p className="text-sm text-white/60">{company}</p>
          <p className="text-xs text-white/40 mt-0.5">{period}</p>
        </div>
      </div>
      {description && <p className="text-sm text-white/60 mt-3">{description}</p>}
      {technologies && technologies.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {technologies.map((tech, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/60">
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ThemePreviewCardComponent({ element }: ComponentRenderProps) {
  const { name, label } = element.props as { name: string; label: string };

  return (
    <Link
      href={`/design/${name}`}
      className="block bg-white/5 rounded-lg p-3 border border-white/10 hover:border-amber-500/50 transition-colors"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/80">{label}</span>
        <ChevronRight className="w-4 h-4 text-white/30" />
      </div>
    </Link>
  );
}

function PhotoGalleryComponent({ element }: ComponentRenderProps) {
  const { photos } = element.props as {
    photos: Array<{ id: string; src: string; alt: string; caption?: string }>;
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {photos.slice(0, 6).map((photo) => (
        <div key={photo.id} className="aspect-square rounded-lg overflow-hidden bg-white/5">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}

function SkillBadgeComponent({ element }: ComponentRenderProps) {
  const { name, level, icon } = element.props as {
    name: string;
    level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    icon?: string;
  };

  const levelColors = {
    beginner: 'bg-gray-500/20 text-gray-400',
    intermediate: 'bg-blue-500/20 text-blue-400',
    advanced: 'bg-purple-500/20 text-purple-400',
    expert: 'bg-amber-500/20 text-amber-400',
  };

  const Icon = icon ? getIcon(icon) : null;

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', level ? levelColors[level] : 'bg-white/10 text-white/80')}>
      {Icon && <Icon className="w-3 h-3" />}
      {name}
      {level && <span className="opacity-60">• {level}</span>}
    </span>
  );
}

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

function EmptyStateComponent({ element }: ComponentRenderProps) {
  const { title, message, icon, actionLabel } = element.props as {
    title: string;
    message?: string;
    icon?: string;
    actionLabel?: string;
  };

  const Icon = icon ? getIcon(icon) : null;

  return (
    <div className="text-center py-8">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
          <Icon className="w-6 h-6 text-white/30" />
        </div>
      )}
      <h4 className="text-sm font-medium text-white/80">{title}</h4>
      {message && <p className="text-xs text-white/50 mt-1">{message}</p>}
      {actionLabel && (
        <button className="mt-4 text-xs text-amber-400 hover:text-amber-300">{actionLabel}</button>
      )}
    </div>
  );
}

function SkeletonComponent({ element }: ComponentRenderProps) {
  const { variant = 'text', width, height, count = 1 } = element.props as {
    variant?: 'text' | 'circular' | 'rectangular' | 'card';
    width?: number | string;
    height?: number | string;
    count?: number;
  };

  const variantClasses = {
    text: 'h-4 w-full rounded',
    circular: 'w-10 h-10 rounded-full',
    rectangular: 'w-full h-20 rounded-lg',
    card: 'w-full h-32 rounded-xl',
  };

  const skeletons = Array(count).fill(0);

  return (
    <div className="space-y-2">
      {skeletons.map((_, i) => (
        <div
          key={i}
          className={cn('bg-white/10 animate-pulse', variantClasses[variant])}
          style={{
            width: width || undefined,
            height: height || undefined,
          }}
        />
      ))}
    </div>
  );
}

// ============================================================================
// FORM COMPONENTS
// ============================================================================

function InputComponent({ element }: ComponentRenderProps) {
  const { label, placeholder, value, type = 'text', disabled, helperText } = element.props as {
    label?: string;
    placeholder?: string;
    value?: string;
    type?: string;
    disabled?: boolean;
    helperText?: string;
  };

  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-medium text-white/70">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={value}
        disabled={disabled}
        className={cn(
          'w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/90',
          'placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      />
      {helperText && <p className="text-[10px] text-white/40">{helperText}</p>}
    </div>
  );
}

function TextareaComponent({ element }: ComponentRenderProps) {
  const { label, placeholder, value, rows = 3, disabled } = element.props as {
    label?: string;
    placeholder?: string;
    value?: string;
    rows?: number;
    disabled?: boolean;
  };

  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-medium text-white/70">{label}</label>}
      <textarea
        placeholder={placeholder}
        defaultValue={value}
        rows={rows}
        disabled={disabled}
        className={cn(
          'w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/90 resize-y',
          'placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      />
    </div>
  );
}

function SelectComponent({ element }: ComponentRenderProps) {
  const { label, placeholder, value, options, disabled } = element.props as {
    label?: string;
    placeholder?: string;
    value?: string;
    options: Array<{ label: string; value: string }>;
    disabled?: boolean;
  };

  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-medium text-white/70">{label}</label>}
      <select
        defaultValue={value || ''}
        disabled={disabled}
        className={cn(
          'w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/90',
          'focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options?.map((opt, i) => (
          <option key={i} value={opt.value} className="bg-zinc-900">{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function CheckboxComponent({ element }: ComponentRenderProps) {
  const { label, checked, disabled } = element.props as {
    label: string;
    checked?: boolean;
    disabled?: boolean;
  };

  return (
    <label className={cn('flex items-center gap-2 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed')}>
      <div className={cn(
        'w-4 h-4 rounded border flex items-center justify-center transition-colors',
        checked ? 'bg-amber-500 border-amber-500' : 'bg-white/5 border-white/20'
      )}>
        {checked && <Check className="w-3 h-3 text-black" />}
      </div>
      <span className="text-sm text-white/80">{label}</span>
    </label>
  );
}

function SwitchComponent({ element }: ComponentRenderProps) {
  const { label, checked, disabled, description } = element.props as {
    label: string;
    checked?: boolean;
    disabled?: boolean;
    description?: string;
  };

  return (
    <div className={cn('flex items-center justify-between gap-3', disabled && 'opacity-50')}>
      <div>
        <span className="text-sm text-white/80">{label}</span>
        {description && <p className="text-[10px] text-white/40">{description}</p>}
      </div>
      <div className={cn(
        'w-9 h-5 rounded-full transition-colors relative',
        checked ? 'bg-amber-500' : 'bg-white/20'
      )}>
        <div className={cn(
          'w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all',
          checked ? 'left-[18px]' : 'left-0.5'
        )} />
      </div>
    </div>
  );
}

function RadioGroupComponent({ element }: ComponentRenderProps) {
  const { label, value, options, direction = 'vertical' } = element.props as {
    label?: string;
    value?: string;
    options: Array<{ label: string; value: string; description?: string }>;
    direction?: 'horizontal' | 'vertical';
  };

  return (
    <div className="space-y-2">
      {label && <span className="text-xs font-medium text-white/70">{label}</span>}
      <div className={cn('flex gap-3', direction === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col')}>
        {options?.map((opt, i) => (
          <label key={i} className="flex items-start gap-2 cursor-pointer">
            <div className={cn(
              'w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5',
              opt.value === value ? 'border-amber-500' : 'border-white/20'
            )}>
              {opt.value === value && <div className="w-2 h-2 rounded-full bg-amber-500" />}
            </div>
            <div>
              <span className="text-sm text-white/80">{opt.label}</span>
              {opt.description && <p className="text-[10px] text-white/40">{opt.description}</p>}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

function SliderComponent({ element }: ComponentRenderProps) {
  const { label, value = 50, min = 0, max = 100, showValue } = element.props as {
    label?: string;
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    showValue?: boolean;
  };

  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-1.5">
      {(label || showValue) && (
        <div className="flex justify-between text-xs text-white/60">
          {label && <span>{label}</span>}
          {showValue && <span>{value}</span>}
        </div>
      )}
      <div className="relative h-5 flex items-center">
        <div className="w-full h-1.5 bg-white/10 rounded-full">
          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${percent}%` }} />
        </div>
        <div
          className="absolute w-4 h-4 bg-amber-500 rounded-full border-2 border-amber-600 shadow-lg"
          style={{ left: `calc(${percent}% - 8px)` }}
        />
      </div>
    </div>
  );
}

function FormComponent({ element, children }: ComponentRenderProps) {
  const { title, description } = element.props as { title?: string; description?: string };

  return (
    <div className="space-y-4 bg-white/5 rounded-xl p-4 border border-white/10">
      {title && <h3 className="text-base font-semibold text-white">{title}</h3>}
      {description && <p className="text-sm text-white/60">{description}</p>}
      <div className="space-y-3">{children}</div>
    </div>
  );
}

// ============================================================================
// NAVIGATION COMPONENTS
// ============================================================================

function TabsComponent({ element, children }: ComponentRenderProps) {
  const { variant = 'default' } = element.props as {
    activeTab?: string;
    variant?: 'default' | 'pills' | 'underline';
  };

  const variantClasses = {
    default: 'border-b border-white/10',
    pills: 'bg-white/5 rounded-lg p-1',
    underline: 'border-b-2 border-white/5',
  };

  return <div className={cn('', variantClasses[variant])}>{children}</div>;
}

function TabComponent({ element }: ComponentRenderProps) {
  const { label, icon } = element.props as {
    id: string;
    label: string;
    icon?: string;
  };

  const Icon = icon ? getIcon(icon) : null;

  return (
    <button className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-white/60 hover:text-white/80 border-b-2 border-transparent hover:border-amber-500/50 transition-colors">
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </button>
  );
}

function TabContentComponent({ children }: ComponentRenderProps) {
  return <div className="py-3">{children}</div>;
}

function BreadcrumbComponent({ element }: ComponentRenderProps) {
  const { items, separator = '/' } = element.props as {
    items: Array<{ label: string; href?: string }>;
    separator?: string;
  };

  return (
    <nav className="flex items-center gap-1.5 text-xs text-white/50">
      {items?.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-white/20">{separator}</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-white/80 transition-colors">{item.label}</Link>
          ) : (
            <span className="text-white/80">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

function PaginationComponent({ element }: ComponentRenderProps) {
  const { currentPage, totalPages, showPageNumbers } = element.props as {
    currentPage: number;
    totalPages: number;
    showPageNumbers?: boolean;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <button className="px-2 py-1 rounded text-xs text-white/50 hover:text-white/80 disabled:opacity-30" disabled={currentPage <= 1}>
        Prev
      </button>
      {showPageNumbers && Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            className={cn(
              'w-7 h-7 rounded text-xs transition-colors',
              page === currentPage ? 'bg-amber-500 text-black' : 'text-white/50 hover:text-white/80'
            )}
          >
            {page}
          </button>
        );
      })}
      {!showPageNumbers && <span className="text-xs text-white/50">{currentPage} / {totalPages}</span>}
      <button className="px-2 py-1 rounded text-xs text-white/50 hover:text-white/80 disabled:opacity-30" disabled={currentPage >= totalPages}>
        Next
      </button>
    </div>
  );
}

function StepperComponent({ element }: ComponentRenderProps) {
  const { steps, orientation = 'horizontal' } = element.props as {
    steps: Array<{ label: string; description?: string; status?: 'completed' | 'current' | 'upcoming' }>;
    orientation?: 'horizontal' | 'vertical';
  };

  const statusConfig = {
    completed: { bg: 'bg-green-500', text: 'text-green-400' },
    current: { bg: 'bg-amber-500', text: 'text-amber-400' },
    upcoming: { bg: 'bg-white/20', text: 'text-white/40' },
  };

  return (
    <div className={cn('flex gap-2', orientation === 'vertical' ? 'flex-col' : 'flex-row items-center')}>
      {steps?.map((step, i) => {
        const config = statusConfig[step.status || 'upcoming'];
        return (
          <div key={i} className={cn('flex items-center gap-2', orientation === 'horizontal' && 'flex-1')}>
            <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium', config.bg, step.status === 'completed' ? 'text-white' : 'text-black')}>
              {step.status === 'completed' ? <Check className="w-3 h-3" /> : i + 1}
            </div>
            <div className="min-w-0">
              <p className={cn('text-xs font-medium', config.text)}>{step.label}</p>
              {step.description && <p className="text-[10px] text-white/30">{step.description}</p>}
            </div>
            {orientation === 'horizontal' && i < steps.length - 1 && (
              <div className="flex-1 h-0.5 bg-white/10 mx-2" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// EXTENDED LAYOUT COMPONENTS
// ============================================================================

function AccordionComponent({ children }: ComponentRenderProps) {
  return <div className="space-y-1">{children}</div>;
}

function AccordionItemComponent({ element, children }: ComponentRenderProps) {
  const { title, subtitle, icon } = element.props as {
    title: string;
    subtitle?: string;
    defaultOpen?: boolean;
    icon?: string;
  };

  const Icon = icon ? getIcon(icon) : null;

  return (
    <details className="group bg-white/5 rounded-lg border border-white/10 overflow-hidden">
      <summary className="flex items-center justify-between px-3 py-2.5 cursor-pointer select-none list-none">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-white/40" />}
          <div>
            <span className="text-sm font-medium text-white/90">{title}</span>
            {subtitle && <p className="text-[10px] text-white/40">{subtitle}</p>}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-white/30 transition-transform group-open:rotate-90" />
      </summary>
      <div className="px-3 pb-3 pt-1">{children}</div>
    </details>
  );
}

function DialogComponent({ element, children }: ComponentRenderProps) {
  const { title, description } = element.props as {
    title: string;
    description?: string;
    open?: boolean;
  };

  return (
    <div className="bg-white/5 border border-white/20 rounded-xl p-4 shadow-2xl">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      {description && <p className="text-sm text-white/50 mt-1">{description}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

function DrawerComponent({ element, children }: ComponentRenderProps) {
  const { title, description, side = 'right' } = element.props as {
    title: string;
    description?: string;
    side?: 'left' | 'right' | 'top' | 'bottom';
  };

  const sideClasses = {
    left: 'border-r',
    right: 'border-l',
    top: 'border-b',
    bottom: 'border-t',
  };

  return (
    <div className={cn('bg-white/5 border-white/10 p-4', sideClasses[side])}>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      {description && <p className="text-sm text-white/50 mt-1">{description}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

function TooltipComponent({ element, children }: ComponentRenderProps) {
  const { content } = element.props as { content: string; side?: string };

  return (
    <div className="relative group inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-zinc-800 border border-white/10 rounded text-xs text-white/80 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {content}
      </div>
    </div>
  );
}

function SeparatorComponent({ element }: ComponentRenderProps) {
  const { label, variant = 'solid' } = element.props as {
    label?: string;
    variant?: 'solid' | 'dashed' | 'dotted';
  };

  const variantClasses = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  };

  if (label) {
    return (
      <div className="flex items-center gap-3 my-3">
        <div className={cn('flex-1 border-t border-white/10', variantClasses[variant])} />
        <span className="text-xs text-white/40">{label}</span>
        <div className={cn('flex-1 border-t border-white/10', variantClasses[variant])} />
      </div>
    );
  }

  return <div className={cn('border-t border-white/10 my-3', variantClasses[variant])} />;
}

// ============================================================================
// MORE DATA VISUALIZATION
// ============================================================================

function LineChartComponent({ element }: ComponentRenderProps) {
  const { data, title, showDots, showGrid, color = '#f59e0b' } = element.props as {
    data: Array<{ label: string; value: number }>;
    title?: string;
    showDots?: boolean;
    showGrid?: boolean;
    color?: string;
  };

  if (!data || data.length < 2) return null;

  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const range = max - min || 1;
  const width = 300;
  const height = 120;
  const padding = 20;

  const points = data.map((d, i) => ({
    x: padding + (i / (data.length - 1)) * (width - 2 * padding),
    y: padding + (1 - (d.value - min) / range) * (height - 2 * padding),
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="space-y-2">
      {title && <h4 className="text-sm font-medium text-white">{title}</h4>}
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {showGrid && Array.from({ length: 4 }, (_, i) => (
          <line key={i} x1={padding} x2={width - padding} y1={padding + (i / 3) * (height - 2 * padding)} y2={padding + (i / 3) * (height - 2 * padding)} stroke="rgba(255,255,255,0.05)" />
        ))}
        <path d={pathD} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {showDots && points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill={color} />
        ))}
      </svg>
      <div className="flex justify-between text-[10px] text-white/30 px-1">
        {data.map((d, i) => i === 0 || i === data.length - 1 ? <span key={i}>{d.label}</span> : <span key={i} />)}
      </div>
    </div>
  );
}

function SparklineComponent({ element }: ComponentRenderProps) {
  const { data, color = '#f59e0b', height = 24, showArea } = element.props as {
    data: number[];
    color?: string;
    height?: number;
    showArea?: boolean;
  };

  if (!data || data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 100;

  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: (1 - (v - min) / range) * height,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = pathD + ` L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
      {showArea && <path d={areaD} fill={color} opacity={0.1} />}
      <path d={pathD} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DonutChartComponent({ element }: ComponentRenderProps) {
  const { data, title, centerLabel, centerValue } = element.props as {
    data: Array<{ label: string; value: number; color?: string }>;
    title?: string;
    centerLabel?: string;
    centerValue?: string;
  };

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const defaultColors = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4'];

  let currentAngle = 0;
  const segments = data.map((d, i) => {
    const angle = (d.value / total) * 360;
    const segment = {
      ...d,
      color: d.color || defaultColors[i % defaultColors.length],
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
    };
    currentAngle += angle;
    return segment;
  });

  const gradient = segments.map(s => `${s.color} ${s.startAngle}deg ${s.endAngle}deg`).join(', ');

  return (
    <div className="space-y-3">
      {title && <h4 className="text-sm font-medium text-white text-center">{title}</h4>}
      <div className="flex items-center justify-center gap-6">
        <div className="relative w-24 h-24">
          <div className="w-full h-full rounded-full" style={{ background: `conic-gradient(${gradient})` }} />
          <div className="absolute inset-3 rounded-full bg-zinc-900 flex flex-col items-center justify-center">
            {centerValue && <span className="text-sm font-bold text-white">{centerValue}</span>}
            {centerLabel && <span className="text-[9px] text-white/40">{centerLabel}</span>}
          </div>
        </div>
        <div className="space-y-1">
          {segments.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
              <span className="text-xs text-white/60">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DataTableComponent({ element }: ComponentRenderProps) {
  const { headers, rows, striped, compact, caption } = element.props as {
    headers: Array<{ key: string; label: string; align?: 'left' | 'center' | 'right' }>;
    rows: Array<Record<string, string>>;
    striped?: boolean;
    compact?: boolean;
    caption?: string;
  };

  const alignClasses = { left: 'text-left', center: 'text-center', right: 'text-right' };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        {caption && <caption className="text-xs text-white/50 mb-2">{caption}</caption>}
        <thead>
          <tr className="border-b border-white/10">
            {headers?.map((h, i) => (
              <th key={i} className={cn('px-3 text-xs text-white/50 font-medium uppercase', compact ? 'py-1' : 'py-2', alignClasses[h.align || 'left'])}>
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows?.map((row, i) => (
            <tr key={i} className={cn('border-b border-white/5', striped && i % 2 === 1 && 'bg-white/[0.02]')}>
              {headers?.map((h, j) => (
                <td key={j} className={cn('px-3 text-white/80', compact ? 'py-1' : 'py-2', alignClasses[h.align || 'left'])}>
                  {row[h.key] || ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// FEEDBACK COMPONENTS
// ============================================================================

function SpinnerComponent({ element }: ComponentRenderProps) {
  const { size = 'md', label } = element.props as { size?: string; label?: string };

  const sizeClasses: Record<string, string> = { xs: 'w-3 h-3', sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };

  return (
    <div className="flex items-center gap-2">
      <div className={cn('border-2 border-white/10 border-t-amber-500 rounded-full animate-spin', sizeClasses[size] || sizeClasses.md)} />
      {label && <span className="text-xs text-white/50">{label}</span>}
    </div>
  );
}

function RatingComponent({ element }: ComponentRenderProps) {
  const { value, maxValue = 5, label, size = 'md' } = element.props as {
    value: number;
    maxValue?: number;
    label?: string;
    size?: 'sm' | 'md' | 'lg';
  };

  const sizeClasses = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' };
  const StarIcon = getIcon('star') || Star;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: maxValue }, (_, i) => (
          <StarIcon
            key={i}
            className={cn(sizeClasses[size], i < value ? 'text-amber-400 fill-amber-400' : 'text-white/20')}
          />
        ))}
      </div>
      {label && <span className="text-xs text-white/50">{label}</span>}
    </div>
  );
}

// ============================================================================
// RICH CONTENT COMPONENTS
// ============================================================================

function BlockquoteComponent({ element }: ComponentRenderProps) {
  const { content, author, source } = element.props as {
    content: string;
    author?: string;
    source?: string;
  };

  return (
    <blockquote className="border-l-2 border-amber-500/50 pl-4 py-1">
      <p className="text-sm text-white/80 italic">{content}</p>
      {(author || source) && (
        <footer className="mt-1.5 text-xs text-white/40">
          {author && <span>{author}</span>}
          {author && source && <span> — </span>}
          {source && <cite>{source}</cite>}
        </footer>
      )}
    </blockquote>
  );
}

function MarkdownComponent({ element }: ComponentRenderProps) {
  const { content } = element.props as { content: string };

  // Simple markdown rendering (bold, italic, code, links)
  const rendered = content
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/`(.*?)`/g, '<code class="font-mono text-xs text-amber-400 bg-white/5 px-1 rounded">$1</code>')
    .replace(/\n/g, '<br />');

  return <div className="text-sm text-white/80 prose-invert" dangerouslySetInnerHTML={{ __html: rendered }} />;
}

function MetricRowComponent({ element }: ComponentRenderProps) {
  const { metrics } = element.props as {
    metrics: Array<{ label: string; value: string | number; change?: number; trend?: 'up' | 'down' | 'neutral'; icon?: string }>;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {metrics?.map((m, i) => {
        const Icon = m.icon ? getIcon(m.icon) : null;
        const trendColor = m.trend === 'up' ? 'text-green-400' : m.trend === 'down' ? 'text-red-400' : 'text-white/40';
        return (
          <div key={i} className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/40 uppercase tracking-wider">{m.label}</span>
              {Icon && <Icon className="w-3.5 h-3.5 text-white/20" />}
            </div>
            <p className="text-lg font-bold text-white mt-0.5">{m.value}</p>
            {m.change !== undefined && (
              <span className={cn('text-[10px]', trendColor)}>
                {m.change > 0 ? '+' : ''}{m.change}%
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function AvatarGroupComponent({ element }: ComponentRenderProps) {
  const { avatars, max = 5, size = 'md' } = element.props as {
    avatars: Array<{ src?: string; alt: string; fallback?: string }>;
    max?: number;
    size?: 'xs' | 'sm' | 'md' | 'lg';
  };

  const sizeClasses = { xs: 'w-6 h-6 text-[8px]', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  const visible = avatars?.slice(0, max) || [];
  const remaining = (avatars?.length || 0) - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((a, i) => (
        <div key={i} className={cn('rounded-full border-2 border-zinc-900 bg-amber-500/20 text-amber-400 flex items-center justify-center font-medium', sizeClasses[size])}>
          {a.src ? (
            <Image src={a.src} alt={a.alt} width={40} height={40} className="w-full h-full rounded-full object-cover" />
          ) : (
            a.fallback || a.alt.charAt(0).toUpperCase()
          )}
        </div>
      ))}
      {remaining > 0 && (
        <div className={cn('rounded-full border-2 border-zinc-900 bg-white/10 text-white/60 flex items-center justify-center font-medium', sizeClasses[size])}>
          +{remaining}
        </div>
      )}
    </div>
  );
}

function CountdownComponent({ element }: ComponentRenderProps) {
  const { targetDate, label, showDays = true, showHours = true, showMinutes = true, showSeconds = true } = element.props as {
    targetDate: string;
    label?: string;
    showDays?: boolean;
    showHours?: boolean;
    showMinutes?: boolean;
    showSeconds?: boolean;
  };

  const target = new Date(targetDate);
  const now = new Date();
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const units = [
    showDays && { value: days, label: 'Days' },
    showHours && { value: hours, label: 'Hours' },
    showMinutes && { value: minutes, label: 'Min' },
    showSeconds && { value: seconds, label: 'Sec' },
  ].filter(Boolean) as Array<{ value: number; label: string }>;

  return (
    <div className="text-center space-y-2">
      {label && <p className="text-xs text-white/50">{label}</p>}
      <div className="flex justify-center gap-3">
        {units.map((u, i) => (
          <div key={i} className="bg-white/5 rounded-lg px-3 py-2 border border-white/10 min-w-[48px]">
            <p className="text-xl font-bold text-white tabular-nums">{String(u.value).padStart(2, '0')}</p>
            <p className="text-[9px] text-white/40 uppercase">{u.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ToggleGroupComponent({ element }: ComponentRenderProps) {
  const { options, value } = element.props as {
    options: Array<{ label: string; value: string; icon?: string }>;
    value?: string;
    allowMultiple?: boolean;
  };

  return (
    <div className="inline-flex bg-white/5 rounded-lg p-0.5 border border-white/10">
      {options?.map((opt, i) => {
        const Icon = opt.icon ? getIcon(opt.icon) : null;
        const isActive = opt.value === value;
        return (
          <button
            key={i}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
              isActive ? 'bg-amber-500 text-black' : 'text-white/60 hover:text-white/80'
            )}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================================
// DESIGN GALLERY / THEME COMPONENTS
// ============================================================================

/** Map theme tokens to CSS variable references */
function resolveThemeColor(color: string): string {
  const tokenMap: Record<string, string> = {
    primary: 'hsl(var(--theme-primary))',
    'primary-foreground': 'hsl(var(--theme-primary-foreground))',
    secondary: 'hsl(var(--theme-secondary))',
    accent: 'hsl(var(--theme-accent))',
    background: 'hsl(var(--theme-background))',
    foreground: 'hsl(var(--theme-foreground))',
    muted: 'hsl(var(--theme-muted))',
    border: 'hsl(var(--theme-border))',
    card: 'hsl(var(--theme-card))',
  };
  return tokenMap[color] || color;
}

function ColorSwatchComponent({ element }: ComponentRenderProps) {
  const { color, label, size = 'md', showHex } = element.props as {
    color: string;
    label?: string;
    size?: 'sm' | 'md' | 'lg';
    showHex?: boolean;
  };

  const sizeClasses = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16' };
  const resolved = resolveThemeColor(color);

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn('rounded-lg border border-white/10 shadow-sm', sizeClasses[size])}
        style={{ backgroundColor: resolved }}
      />
      {label && <span className="text-[10px] text-white/50">{label}</span>}
      {showHex && <span className="text-[9px] font-mono text-white/30">{color}</span>}
    </div>
  );
}

function ColorPaletteComponent({ element }: ComponentRenderProps) {
  const { colors, title, layout = 'row' } = element.props as {
    colors: Array<{ color: string; label: string }>;
    title?: string;
    layout?: 'row' | 'grid';
  };

  return (
    <div className="space-y-2">
      {title && <h4 className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>{title}</h4>}
      <div className={cn(
        layout === 'grid' ? 'grid grid-cols-4 gap-3' : 'flex gap-3 flex-wrap'
      )}>
        {colors?.map((c, i) => {
          const resolved = resolveThemeColor(c.color);
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className="w-12 h-12 rounded-lg border border-white/10 shadow-sm"
                style={{ backgroundColor: resolved }}
              />
              <span className="text-[10px] text-white/50">{c.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DesignThemeCardComponent({ element }: ComponentRenderProps) {
  const { themeName, headline, tagline, font, colors, showApplyButton } = element.props as {
    themeName: string;
    headline?: string;
    tagline?: string;
    font?: string;
    colors?: { primary?: string; secondary?: string; accent?: string; background?: string };
    showApplyButton?: boolean;
  };

  const isValid = isValidTheme(themeName);
  const label = isValid ? getThemeLabel(themeName) : themeName;

  return (
    <div
      className="rounded-xl border overflow-hidden"
      data-design-theme={themeName}
      style={{
        borderColor: 'hsl(var(--theme-border))',
        backgroundColor: 'hsl(var(--theme-card))',
      }}
    >
      {/* Color bar */}
      <div className="h-2 flex">
        {colors?.primary && <div className="flex-1" style={{ backgroundColor: colors.primary }} />}
        {colors?.accent && <div className="flex-1" style={{ backgroundColor: colors.accent }} />}
        {colors?.secondary && <div className="flex-1" style={{ backgroundColor: colors.secondary }} />}
        {!colors && <div className="flex-1" style={{ background: 'hsl(var(--theme-primary))' }} />}
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold" style={{ color: 'hsl(var(--theme-foreground))' }}>{label}</h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ backgroundColor: 'hsl(var(--theme-muted))', color: 'hsl(var(--theme-muted-foreground))' }}>
            {themeName}
          </span>
        </div>

        {headline && <p className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>{headline}</p>}
        {tagline && <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{tagline}</p>}
        {font && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Font:</span>
            <span className="text-xs font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>{font}</span>
          </div>
        )}

        {/* Mini color swatches */}
        {colors && (
          <div className="flex gap-1.5 pt-1">
            {Object.entries(colors).map(([key, value]) => value && (
              <div key={key} className="flex flex-col items-center gap-0.5">
                <div className="w-6 h-6 rounded-md border border-white/10" style={{ backgroundColor: value }} />
                <span className="text-[8px] text-white/30">{key}</span>
              </div>
            ))}
          </div>
        )}

        {showApplyButton && isValid && (
          <Link
            href={`/design/${themeName}`}
            className="block w-full mt-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors text-center"
            style={{
              backgroundColor: 'hsl(var(--theme-primary))',
              color: 'hsl(var(--theme-primary-foreground))',
            }}
          >
            Apply {label}
          </Link>
        )}
      </div>
    </div>
  );
}

function ThemeGridComponent({ element }: ComponentRenderProps) {
  const { themes, columns = 3 } = element.props as {
    themes: Array<{
      themeName: string;
      label: string;
      headline?: string;
      colors?: { primary?: string; accent?: string; background?: string };
    }>;
    columns?: number;
  };

  const gridCols: Record<number, string> = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' };

  return (
    <div className={cn('grid gap-3', gridCols[columns] || 'grid-cols-3')}>
      {themes?.map((t, i) => (
        <Link
          key={i}
          href={`/design?theme=${t.themeName}`}
          className="group rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02]"
        >
          {/* Color preview bar */}
          <div className="h-16 relative flex">
            <div className="flex-1" style={{ backgroundColor: t.colors?.background || '#1a1a1a' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex gap-1">
                {t.colors?.primary && <div className="w-5 h-5 rounded-full shadow-lg" style={{ backgroundColor: t.colors.primary }} />}
                {t.colors?.accent && <div className="w-5 h-5 rounded-full shadow-lg" style={{ backgroundColor: t.colors.accent }} />}
              </div>
            </div>
          </div>
          <div className="px-3 py-2 bg-white/5">
            <p className="text-xs font-medium text-white/80">{t.label}</p>
            {t.headline && <p className="text-[10px] text-white/40 truncate">{t.headline}</p>}
          </div>
        </Link>
      ))}
    </div>
  );
}

function ThemeShowcaseComponent({ element, children }: ComponentRenderProps) {
  const { themeName, showColorTokens, showTypography, showComponents } = element.props as {
    themeName: string;
    showColorTokens?: boolean;
    showTypography?: boolean;
    showComponents?: boolean;
  };

  const isValid = isValidTheme(themeName);
  const label = isValid ? getThemeLabel(themeName) : themeName;

  const colorTokens = [
    { name: 'Background', var: '--theme-background' },
    { name: 'Foreground', var: '--theme-foreground' },
    { name: 'Primary', var: '--theme-primary' },
    { name: 'Secondary', var: '--theme-secondary' },
    { name: 'Accent', var: '--theme-accent' },
    { name: 'Muted', var: '--theme-muted' },
    { name: 'Border', var: '--theme-border' },
    { name: 'Card', var: '--theme-card' },
  ];

  return (
    <div
      className="rounded-xl border overflow-hidden"
      data-design-theme={themeName}
      style={{
        borderColor: 'hsl(var(--theme-border))',
        backgroundColor: 'hsl(var(--theme-background))',
        color: 'hsl(var(--theme-foreground))',
        fontFamily: 'var(--theme-font)',
      }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--theme-font-heading)' }}>{label}</h3>
        <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Design Theme: {themeName}</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Color tokens */}
        {showColorTokens && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Color Tokens</h4>
            <div className="grid grid-cols-4 gap-2">
              {colorTokens.map((token) => (
                <div key={token.var} className="flex flex-col items-center gap-1">
                  <div
                    className="w-full h-8 rounded-md border"
                    style={{ backgroundColor: `hsl(var(${token.var}))`, borderColor: 'hsl(var(--theme-border))' }}
                  />
                  <span className="text-[9px]" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{token.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Typography */}
        {showTypography && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Typography</h4>
            <div className="space-y-1">
              <p className="text-2xl font-bold" style={{ fontFamily: 'var(--theme-font-heading)' }}>Heading Text</p>
              <p className="text-base" style={{ fontFamily: 'var(--theme-font)' }}>Body text in the theme&apos;s primary font. This is how regular content appears.</p>
              <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Muted secondary text for supporting content.</p>
            </div>
          </div>
        )}

        {/* Sample components */}
        {showComponents && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Components</h4>
            <div className="flex gap-2 flex-wrap">
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: 'hsl(var(--theme-primary))', color: 'hsl(var(--theme-primary-foreground))' }}>
                Primary
              </button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: 'hsl(var(--theme-secondary))', color: 'hsl(var(--theme-secondary-foreground))' }}>
                Secondary
              </button>
              <button className="px-3 py-1.5 rounded-lg text-xs border font-medium" style={{ borderColor: 'hsl(var(--theme-border))', color: 'hsl(var(--theme-foreground))' }}>
                Outlined
              </button>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: 'hsl(var(--theme-accent))', color: 'hsl(var(--theme-accent-foreground))' }}>
                Badge
              </span>
            </div>
            <div className="p-3 rounded-lg border" style={{ borderColor: 'hsl(var(--theme-border))', backgroundColor: 'hsl(var(--theme-card))' }}>
              <p className="text-sm font-medium" style={{ color: 'hsl(var(--theme-card-foreground))' }}>Sample Card</p>
              <p className="text-xs mt-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>This card uses the theme&apos;s card tokens.</p>
            </div>
          </div>
        )}

        {/* Custom children */}
        {children}
      </div>
    </div>
  );
}

// ============================================================================
// FALLBACK COMPONENT
// ============================================================================

function FallbackComponent({ element }: ComponentRenderProps) {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
      <p className="text-xs text-red-400">Unknown component type: {element.type}</p>
      <pre className="text-xs text-white/40 mt-1 overflow-auto">
        {JSON.stringify(element.props, null, 2)}
      </pre>
    </div>
  );
}

// ============================================================================
// COMPONENT REGISTRY
// ============================================================================

export const clawAIRegistry: ComponentRegistry = {
  // Text
  text: TextComponent,
  heading: HeadingComponent,

  // Layout
  card: CardComponent,
  stack: StackComponent,
  grid: GridComponent,
  divider: DividerComponent,

  // Interactive
  button: ButtonComponent,
  link: LinkComponent,
  badge: BadgeComponent,
  tag: TagComponent,

  // Data display
  statCard: StatCardComponent,
  progress: ProgressComponent,
  avatar: AvatarComponent,
  icon: IconComponent,

  // Lists
  list: ListComponent,
  listItem: ListItemComponent,

  // Media
  image: ImageComponent,

  // Code
  codeBlock: CodeBlockComponent,
  inlineCode: InlineCodeComponent,

  // Alerts
  alert: AlertComponent,
  callout: CalloutComponent,

  // Table
  table: TableComponent,

  // Key-value
  keyValue: KeyValueComponent,
  keyValueList: KeyValueListComponent,

  // Timeline
  timeline: TimelineComponent,
  timelineItem: TimelineItemComponent,

  // Charts
  barChart: BarChartComponent,
  pieChart: PieChartComponent,

  // Portfolio-specific
  weatherWidget: WeatherWidgetComponent,
  taskCard: TaskCardComponent,
  projectCard: ProjectCardComponent,
  workExperienceCard: WorkExperienceCardComponent,
  themePreviewCard: ThemePreviewCardComponent,
  photoGallery: PhotoGalleryComponent,
  skillBadge: SkillBadgeComponent,

  // Utility
  emptyState: EmptyStateComponent,
  skeleton: SkeletonComponent,

  // Form components
  input: InputComponent,
  textarea: TextareaComponent,
  select: SelectComponent,
  checkbox: CheckboxComponent,
  switch: SwitchComponent,
  radioGroup: RadioGroupComponent,
  slider: SliderComponent,
  form: FormComponent,

  // Navigation components
  tabs: TabsComponent,
  tab: TabComponent,
  tabContent: TabContentComponent,
  breadcrumb: BreadcrumbComponent,
  pagination: PaginationComponent,
  stepper: StepperComponent,

  // Extended layout
  accordion: AccordionComponent,
  accordionItem: AccordionItemComponent,
  dialog: DialogComponent,
  drawer: DrawerComponent,
  tooltip: TooltipComponent,
  separator: SeparatorComponent,

  // More data visualization
  lineChart: LineChartComponent,
  sparkline: SparklineComponent,
  donutChart: DonutChartComponent,
  dataTable: DataTableComponent,

  // Feedback
  spinner: SpinnerComponent,
  rating: RatingComponent,

  // Rich content
  blockquote: BlockquoteComponent,
  markdown: MarkdownComponent,
  metricRow: MetricRowComponent,
  avatarGroup: AvatarGroupComponent,
  countdown: CountdownComponent,
  toggleGroup: ToggleGroupComponent,

  // Design Gallery / Theme components
  colorSwatch: ColorSwatchComponent,
  colorPalette: ColorPaletteComponent,
  designThemeCard: DesignThemeCardComponent,
  themeGrid: ThemeGridComponent,
  themeShowcase: ThemeShowcaseComponent,
};

export const fallbackRenderer = FallbackComponent;
