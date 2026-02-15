'use client';

import React from 'react';
import { Construction, Clock, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PrototypeStateProps {
  title: string;
  description?: string;
  type?: 'prototype' | 'coming-soon' | 'concept';
  showBackButton?: boolean;
  backHref?: string;
  children?: React.ReactNode;
}

/**
 * PrototypeState - Intentional state for unfinished features
 *
 * Rule: Nothing visible is allowed to fail without explanation.
 */
export function PrototypeState({
  title,
  description,
  type = 'prototype',
  showBackButton = true,
  backHref = '/',
  children,
}: PrototypeStateProps) {
  const configs = {
    prototype: {
      icon: Construction,
      label: 'Prototype',
      color: 'text-amber-400',
      bg: 'bg-amber-500/20',
      border: 'border-amber-500/30',
    },
    'coming-soon': {
      icon: Clock,
      label: 'Coming Soon',
      color: 'text-blue-400',
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/30',
    },
    concept: {
      icon: Sparkles,
      label: 'Concept',
      color: 'text-purple-400',
      bg: 'bg-purple-500/20',
      border: 'border-purple-500/30',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Status Badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} ${config.border} border mb-6`}>
          <Icon className={`w-4 h-4 ${config.color}`} />
          <span className={`text-sm font-medium ${config.color}`}>
            {config.label}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-3" style={{ color: 'hsl(var(--foreground))' }}>
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p className="mb-6" style={{ color: 'hsl(var(--muted-foreground))' }}>
            {description}
          </p>
        )}

        {/* Custom content */}
        {children && (
          <div className="mb-6">
            {children}
          </div>
        )}

        {/* Back button */}
        {showBackButton && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-colors"
            style={{
              backgroundColor: 'hsl(var(--muted))',
              color: 'hsl(var(--foreground))',
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Link>
        )}
      </div>
    </div>
  );
}

/**
 * DisabledFeature - For disabled interactive elements
 */
export function DisabledFeature({
  children,
  reason = 'This feature is not yet implemented',
}: {
  children: React.ReactNode;
  reason?: string;
}) {
  return (
    <div className="relative group">
      <div className="opacity-50 pointer-events-none select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="px-3 py-2 rounded-lg bg-neutral-900/90 text-white text-sm">
          {reason}
        </div>
      </div>
    </div>
  );
}
