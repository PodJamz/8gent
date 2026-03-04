'use client';

/**
 * System Page - Core OS Information & Controls
 *
 * Deterministic route: /system
 * Shows OS status, architecture, and system controls.
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Cpu,
  HardDrive,
  Globe,
  Layers,
  Settings,
  Lock,
  Activity,
  Boxes,
  GitBranch,
  Database,
  Zap,
  ChevronRight,
  Monitor,
  Moon,
  Sun,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { LiquidGlass } from '@/components/ui/liquid-glass';

interface SystemInfo {
  os: string;
  browser: string;
  screenSize: string;
  colorScheme: string;
  memory: string;
  online: boolean;
}

export default function SystemPage() {
  const { theme, setTheme } = useTheme();
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Gather system info client-side
    const info: SystemInfo = {
      os: navigator.platform || 'Unknown',
      browser: navigator.userAgent.split(' ').slice(-1)[0] || 'Unknown',
      screenSize: `${window.screen.width}x${window.screen.height}`,
      colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light',
      memory: (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory}GB` : 'Unknown',
      online: navigator.onLine,
    };
    setSystemInfo(info);
  }, []);

  const systemApps = [
    { name: 'Settings', href: '/settings', icon: Settings, description: 'Preferences & configuration' },
    { name: 'Vault', href: '/vault', icon: Lock, description: 'Secure storage' },
    { name: 'Activity', href: '/activity', icon: Activity, description: 'System activity log' },
  ];

  const architecture = [
    { name: 'Apps', count: 35, icon: Boxes, description: 'Available applications' },
    { name: 'Agents', count: 7, icon: Zap, description: 'AI agent workers' },
    { name: 'Threads', count: 12, icon: GitBranch, description: 'Active thread contexts' },
    { name: 'Projects', count: 3, icon: Database, description: 'Managed projects' },
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <Cpu className="w-12 h-12 opacity-50" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>
                System
              </h1>
              <p style={{ color: 'hsl(var(--muted-foreground))' }}>
                8gent OS v1.0
              </p>
            </div>
          </div>
        </motion.div>

        {/* Product Thesis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <LiquidGlass className="p-6 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                  Product Thesis
                </h2>
                <p className="text-lg" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  8gent OS is a personal, agentic operating system for <strong style={{ color: 'hsl(var(--foreground))' }}>discovering</strong>, <strong style={{ color: 'hsl(var(--foreground))' }}>designing</strong>, <strong style={{ color: 'hsl(var(--foreground))' }}>planning</strong>, and <strong style={{ color: 'hsl(var(--foreground))' }}>shipping</strong> products.
                </p>
                <p className="mt-2 text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  The OS itself is the product, not a wrapper.
                </p>
              </div>
            </div>
          </LiquidGlass>
        </motion.div>

        {/* Architecture Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'hsl(var(--foreground))' }}>
            Architecture
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {architecture.map((item) => (
              <LiquidGlass key={item.name} className="p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  {React.createElement(item.icon, { className: "w-5 h-5", style: { color: 'hsl(var(--primary))' } })}
                  <span className="text-2xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>
                    {item.count}
                  </span>
                </div>
                <div className="text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                  {item.name}
                </div>
                <div className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  {item.description}
                </div>
              </LiquidGlass>
            ))}
          </div>
        </motion.div>

        {/* Quick Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'hsl(var(--foreground))' }}>
            Quick Settings
          </h2>
          <LiquidGlass className="rounded-2xl overflow-hidden">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
                ) : (
                  <Sun className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
                )}
                <div className="text-left">
                  <div className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                    Appearance
                  </div>
                  <div className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5" style={{ color: 'hsl(var(--muted-foreground))' }} />
            </button>
          </LiquidGlass>
        </motion.div>

        {/* System Apps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'hsl(var(--foreground))' }}>
            System Apps
          </h2>
          <div className="space-y-2">
            {systemApps.map((app) => (
              <Link key={app.name} href={app.href}>
                <LiquidGlass className="p-4 rounded-xl flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neutral-600 to-neutral-800 flex items-center justify-center">
                      {React.createElement(app.icon, { className: "w-5 h-5 text-white" })}
                    </div>
                    <div>
                      <div className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                        {app.name}
                      </div>
                      <div className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                        {app.description}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5" style={{ color: 'hsl(var(--muted-foreground))' }} />
                </LiquidGlass>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Device Info */}
        {systemInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'hsl(var(--foreground))' }}>
              Device Info
            </h2>
            <LiquidGlass className="p-4 rounded-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Monitor className="w-5 h-5" style={{ color: 'hsl(var(--muted-foreground))' }} />
                  <div>
                    <div className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Screen</div>
                    <div className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>{systemInfo.screenSize}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5" style={{ color: 'hsl(var(--muted-foreground))' }} />
                  <div>
                    <div className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Status</div>
                    <div className="font-medium" style={{ color: systemInfo.online ? 'hsl(142, 71%, 45%)' : 'hsl(0, 84%, 60%)' }}>
                      {systemInfo.online ? 'Online' : 'Offline'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <HardDrive className="w-5 h-5" style={{ color: 'hsl(var(--muted-foreground))' }} />
                  <div>
                    <div className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Memory</div>
                    <div className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>{systemInfo.memory}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5" style={{ color: 'hsl(var(--muted-foreground))' }} />
                  <div>
                    <div className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Platform</div>
                    <div className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>{systemInfo.os}</div>
                  </div>
                </div>
              </div>
            </LiquidGlass>
          </motion.div>
        )}

        {/* Mental Model */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'hsl(var(--foreground))' }}>
            OS Mental Model
          </h2>
          <LiquidGlass className="p-6 rounded-2xl">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Boxes className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>Apps = Capabilities</div>
                  <div className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    Each app provides a distinct capability: design, prototype, plan, ship
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Database className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <div className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>Projects = Contexts</div>
                  <div className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    Each project contains its own threads, artifacts, and kanban board
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>Agents = Workers</div>
                  <div className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    AI agents perform work within threads, producing artifacts
                  </div>
                </div>
              </div>
            </div>
          </LiquidGlass>
        </motion.div>
      </div>
    </div>
  );
}
