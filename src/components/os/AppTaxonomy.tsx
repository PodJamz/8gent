'use client';

/**
 * AppTaxonomy - Explicit App Groupings
 *
 * Groups apps by category with no ambiguity:
 * - Core OS: System, Settings, Vault
 * - Agentic Work: Threads, Product, Projects, Kanban
 * - Creative: Design, Notes, Jamz
 * - Personal/Experimental: Neurodiversity, Vibes, Explore
 */

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Cpu,
  Settings,
  Lock,
  GitBranch,
  Box,
  FolderKanban,
  Layers,
  Palette,
  FileText,
  Music,
  Brain,
  Sparkles,
  Compass,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';

interface AppItem {
  name: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

interface TaxonomyGroup {
  id: string;
  name: string;
  description: string;
  color: string;
  apps: AppItem[];
}

const APP_TAXONOMY: TaxonomyGroup[] = [
  {
    id: 'control',
    name: 'Control',
    description: 'System management and orchestration',
    color: '#3b82f6',
    apps: [
      { name: 'Overview', href: '/system', icon: Cpu, description: 'System health & status' },
      { name: 'Channels', href: '/settings/channels', icon: Layers, description: 'External integrations' },
      { name: 'Instances', href: '/instances', icon: Box, description: 'Running agent instances' },
      { name: 'Sessions', href: '/threads', icon: GitBranch, description: 'Active chat sessions' },
      { name: 'Usage', href: '/usage', icon: Sparkles, description: 'Resource consumption' },
      { name: 'Cron Jobs', href: '/cron', icon: Settings, description: 'Scheduled tasks' },
    ],
  },
  {
    id: 'agents',
    name: 'Agents',
    description: 'Agent configuration and capabilities',
    color: '#8b5cf6',
    apps: [
      { name: 'Agents', href: '/agent', icon: Cpu, description: 'AI Agent control' },
      { name: 'Skills', href: '/skills', icon: Sparkles, description: 'Agent capabilities' },
      { name: 'Nodes', href: '/nodes', icon: Layers, description: 'Logic workflows' },
    ],
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'OS preferences and developer tools',
    color: '#ec4899',
    apps: [
      { name: 'Config', href: '/settings', icon: Settings, description: 'General preferences' },
      { name: 'Debug', href: '/debug', icon: Cpu, description: 'Developer dashboard' },
      { name: 'Logs', href: '/logs', icon: FileText, description: 'System event logs' },
    ],
  },
  {
    id: 'resources',
    name: 'Resources',
    description: 'External documentation and help',
    color: '#10b981',
    apps: [
      { name: 'Docs', href: 'https://docs.openclaw.io', icon: FileText, description: 'Developer documentation' },
    ],
  },
];

interface AppTaxonomyProps {
  variant?: 'full' | 'compact' | 'grid';
  showDescriptions?: boolean;
}

export function AppTaxonomy({ variant = 'full', showDescriptions = true }: AppTaxonomyProps) {
  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-2 gap-4">
        {APP_TAXONOMY.map((group) => (
          <LiquidGlass key={group.id} className="p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: group.color }}
              />
              <h3 className="font-semibold text-sm" style={{ color: 'hsl(var(--foreground))' }}>
                {group.name}
              </h3>
            </div>
            <div className="space-y-1">
              {group.apps.map((app) => (
                <Link
                  key={app.name}
                  href={app.href}
                  className="flex items-center gap-2 p-2 rounded-lg text-sm transition-colors hover:bg-white/10"
                >
                  {React.createElement(app.icon, { className: "w-4 h-4", style: { color: group.color } })}
                  <span style={{ color: 'hsl(var(--foreground))' }}>{app.name}</span>
                </Link>
              ))}
            </div>
          </LiquidGlass>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap gap-2">
        {APP_TAXONOMY.map((group) => (
          <div
            key={group.id}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ backgroundColor: group.color + '20' }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: group.color }}
            />
            <span className="text-xs font-medium" style={{ color: group.color }}>
              {group.name}
            </span>
            <span className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
              ({group.apps.length})
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Full variant
  return (
    <div className="space-y-6">
      {APP_TAXONOMY.map((group, groupIndex) => (
        <motion.div
          key={group.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: groupIndex * 0.1 }}
        >
          <LiquidGlass className="p-6 rounded-2xl">
            {/* Group Header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: group.color + '20' }}
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: group.color }}
                />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
                  {group.name}
                </h3>
                {showDescriptions && (
                  <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {group.description}
                  </p>
                )}
              </div>
            </div>

            {/* Apps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {group.apps.map((app) => (
                <Link
                  key={app.name}
                  href={app.href}
                  className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-white/10"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: group.color + '15' }}
                  >
                    {React.createElement(app.icon, { className: "w-5 h-5", style: { color: group.color } })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate" style={{ color: 'hsl(var(--foreground))' }}>
                      {app.name}
                    </div>
                    {showDescriptions && (
                      <div className="text-xs truncate" style={{ color: 'hsl(var(--muted-foreground))' }}>
                        {app.description}
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'hsl(var(--muted-foreground))' }} />
                </Link>
              ))}
            </div>
          </LiquidGlass>
        </motion.div>
      ))}
    </div>
  );
}

// Export the taxonomy data for use elsewhere
export { APP_TAXONOMY };
export type { TaxonomyGroup, AppItem as TaxonomyAppItem };
