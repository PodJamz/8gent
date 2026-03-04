'use client';

import React from 'react';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickTileProps {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  onClick?: () => void;
  className?: string;
}

function QuickTile({ icon, label, sublabel, onClick, className }: QuickTileProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center p-3 rounded-2xl',
        'transition-all duration-200',
        'hover:scale-105',
        'active:scale-95',
        'focus:outline-none focus-visible:ring-2',
        className
      )}
      style={{
        backgroundColor: 'hsl(var(--theme-card))',
        border: '1px solid hsl(var(--theme-border) / 0.3)',
      }}
    >
      <div className="mb-1" style={{ color: 'hsl(var(--theme-foreground) / 0.8)' }}>{icon}</div>
      <span className="text-[11px] font-medium" style={{ color: 'hsl(var(--theme-foreground) / 0.9)' }}>{label}</span>
      {sublabel && <span className="text-[9px]" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{sublabel}</span>}
    </button>
  );
}

// Single-user mode - no authentication needed
export function ControlCenterAuth() {
  return (
    <div
      className="flex flex-col items-center justify-center p-3 rounded-2xl"
      style={{
        backgroundColor: 'hsl(var(--theme-primary) / 0.15)',
        border: '1px solid hsl(var(--theme-primary) / 0.3)',
      }}
    >
      <User className="w-8 h-8" style={{ color: 'hsl(var(--theme-primary))' }} />
      <span className="text-[10px] mt-1.5" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Owner</span>
    </div>
  );
}
