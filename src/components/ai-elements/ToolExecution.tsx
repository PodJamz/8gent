'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  Circle,
  Wrench,
  Globe,
  FolderOpen,
  Terminal,
} from 'lucide-react';
import { Shimmer } from './Shimmer';

export type ToolState = 'pending' | 'running' | 'completed' | 'error';

export interface ToolExecutionProps {
  name: string;
  skillId?: 'browser-automation' | 'file-system' | 'code-execution';
  state: ToolState;
  input?: Record<string, unknown>;
  output?: string | Record<string, unknown>;
  error?: string;
  duration?: number;
  className?: string;
}

const getSkillIcon = (skillId?: string) => {
  switch (skillId) {
    case 'browser-automation':
      return Globe;
    case 'file-system':
      return FolderOpen;
    case 'code-execution':
      return Terminal;
    default:
      return Wrench;
  }
};

const getStateIcon = (state: ToolState) => {
  switch (state) {
    case 'pending':
      return Circle;
    case 'running':
      return Clock;
    case 'completed':
      return CheckCircle;
    case 'error':
      return XCircle;
  }
};

const getStateColor = (state: ToolState) => {
  switch (state) {
    case 'pending':
      return 'text-white/40';
    case 'running':
      return 'text-orange-400';
    case 'completed':
      return 'text-green-400';
    case 'error':
      return 'text-red-400';
  }
};

const getStateLabel = (state: ToolState) => {
  switch (state) {
    case 'pending':
      return 'Pending';
    case 'running':
      return 'Running';
    case 'completed':
      return 'Completed';
    case 'error':
      return 'Error';
  }
};

export function ToolExecution({
  name,
  skillId,
  state,
  input,
  output,
  error,
  duration,
  className,
}: ToolExecutionProps) {
  const [isExpanded, setIsExpanded] = useState(state === 'running');

  const SkillIcon = getSkillIcon(skillId);
  const StateIcon = getStateIcon(state);
  const stateColor = getStateColor(state);

  return (
    <div
      className={cn(
        'w-full rounded-lg border border-white/10 bg-white/5 overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between gap-3 p-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <SkillIcon className="w-4 h-4 text-white/60 flex-shrink-0" />
          <span className="text-sm font-medium text-white truncate">{name}</span>

          {/* State badge */}
          <div className={cn(
            'flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 text-xs',
            stateColor
          )}>
            <StateIcon className={cn(
              'w-3 h-3',
              state === 'running' && 'animate-pulse'
            )} />
            {state === 'running' ? (
              <Shimmer duration={1}>
                {getStateLabel(state)}
              </Shimmer>
            ) : (
              <span>{getStateLabel(state)}</span>
            )}
          </div>

          {duration !== undefined && state === 'completed' && (
            <span className="text-xs text-white/40">
              {duration < 1000 ? `${duration}ms` : `${(duration / 1000).toFixed(1)}s`}
            </span>
          )}
        </div>

        <ChevronDown
          className={cn(
            'w-4 h-4 text-white/40 transition-transform flex-shrink-0',
            isExpanded && 'rotate-180'
          )}
        />
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/5">
              {/* Input parameters */}
              {input && Object.keys(input).length > 0 && (
                <div className="p-3 border-b border-white/5">
                  <h4 className="text-xs font-medium text-white/40 uppercase tracking-wide mb-2">
                    Parameters
                  </h4>
                  <pre className="text-xs text-white/70 bg-black/30 rounded p-2 overflow-x-auto">
                    {JSON.stringify(input, null, 2)}
                  </pre>
                </div>
              )}

              {/* Output or error */}
              {(output || error) && (
                <div className="p-3">
                  <h4 className={cn(
                    'text-xs font-medium uppercase tracking-wide mb-2',
                    error ? 'text-red-400' : 'text-white/40'
                  )}>
                    {error ? 'Error' : 'Result'}
                  </h4>
                  <pre className={cn(
                    'text-xs rounded p-2 overflow-x-auto',
                    error ? 'text-red-300 bg-red-500/10' : 'text-white/70 bg-black/30'
                  )}>
                    {error || (typeof output === 'string' ? output : JSON.stringify(output, null, 2))}
                  </pre>
                </div>
              )}

              {/* Running state - show activity indicator */}
              {state === 'running' && !output && (
                <div className="p-3 flex items-center gap-2 text-white/40 text-xs">
                  <motion.div
                    className="w-1.5 h-1.5 bg-orange-400 rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  Processing...
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ToolExecution;
