'use client';

/**
 * SimulationLabel - Surface state indicators
 *
 * Labels surfaces as:
 * - Live: Fully functional
 * - Prototype: Work in progress
 * - Concept: Design exploration
 *
 * Turns complexity into intention.
 */

import React from 'react';
import { Activity, Construction, Sparkles, type LucideIcon } from 'lucide-react';

type SimulationMode = 'live' | 'prototype' | 'concept';

interface SimulationLabelProps {
  mode: SimulationMode;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

const configs: Record<SimulationMode, {
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}> = {
  live: {
    label: 'Live',
    icon: Activity,
    color: 'text-green-400',
    bg: 'bg-green-500/20',
  },
  prototype: {
    label: 'Prototype',
    icon: Construction,
    color: 'text-amber-400',
    bg: 'bg-amber-500/20',
  },
  concept: {
    label: 'Concept',
    icon: Sparkles,
    color: 'text-purple-400',
    bg: 'bg-purple-500/20',
  },
};

export function SimulationLabel({
  mode,
  className = '',
  showIcon = true,
  size = 'sm',
}: SimulationLabelProps) {
  const config = configs[mode];
  const Icon = config.icon;

  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-xs gap-1'
    : 'px-3 py-1 text-sm gap-1.5';

  return (
    <div
      className={`inline-flex items-center rounded-full font-medium ${config.bg} ${config.color} ${sizeClasses} ${className}`}
    >
      {showIcon && React.createElement(Icon, { className: size === 'sm' ? 'w-3 h-3' : 'w-4 h-4' })}
      <span>{config.label}</span>
    </div>
  );
}

/**
 * withSimulationLabel - HOC to add simulation label to any component
 */
export function withSimulationLabel<P extends object>(
  Component: React.ComponentType<P>,
  mode: SimulationMode,
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'top-right'
) {
  return function WrappedComponent(props: P) {
    const positionClasses = {
      'top-left': 'top-2 left-2',
      'top-right': 'top-2 right-2',
      'bottom-left': 'bottom-2 left-2',
      'bottom-right': 'bottom-2 right-2',
    };

    return (
      <div className="relative">
        <Component {...props} />
        <div className={`absolute ${positionClasses[position]} z-10`}>
          <SimulationLabel mode={mode} />
        </div>
      </div>
    );
  };
}
