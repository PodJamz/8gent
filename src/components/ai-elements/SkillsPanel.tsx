'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Globe,
  FolderOpen,
  Terminal,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Circle,
  Zap,
  Copy,
  Check,
} from 'lucide-react';
import { skillRegistry, type Skill, type SkillCommand } from '@/skills';

interface SkillsPanelProps {
  className?: string;
  onExecuteCommand?: (skillId: string, command: string) => void;
}

const getSkillIcon = (icon: string) => {
  switch (icon) {
    case 'Globe':
      return Globe;
    case 'FolderOpen':
      return FolderOpen;
    case 'Terminal':
      return Terminal;
    default:
      return Zap;
  }
};

function CommandItem({
  command,
  skillId,
  onExecute,
}: {
  command: SkillCommand;
  skillId: string;
  onExecute?: (skillId: string, cmd: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-b border-white/5 last:border-0">
      <div className="flex items-center justify-between gap-2 py-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-white/80">{command.name}</span>
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="text-white/30 hover:text-white/60 transition-colors"
            >
              {showExamples ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          </div>
          <p className="text-[10px] text-white/40 mt-0.5 line-clamp-1">
            {command.description}
          </p>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => handleCopy(command.syntax)}
            className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white/80 transition-colors"
            title="Copy syntax"
          >
            {copied ? (
              <Check className="w-3 h-3 text-green-400" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
          {onExecute && (
            <button
              onClick={() => onExecute(skillId, command.syntax)}
              className="px-2 py-0.5 text-[10px] rounded bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 transition-colors"
            >
              Run
            </button>
          )}
        </div>
      </div>

      {/* Examples */}
      <AnimatePresence>
        {showExamples && command.examples.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="pb-2 pl-4 space-y-1">
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Examples:</p>
              {command.examples.map((example, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 group"
                >
                  <code className="flex-1 text-[10px] font-mono text-green-400/70 bg-black/30 px-2 py-1 rounded truncate">
                    {example}
                  </code>
                  <button
                    onClick={() => handleCopy(example)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 text-white/40 transition-all"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SkillCard({
  skill,
  onExecuteCommand,
}: {
  skill: Skill;
  onExecuteCommand?: (skillId: string, command: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = getSkillIcon(skill.icon);

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between gap-3 p-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
            skill.enabled ? 'bg-green-500/20' : 'bg-white/10'
          )}>
            <Icon className={cn(
              'w-4 h-4',
              skill.enabled ? 'text-green-400' : 'text-white/40'
            )} />
          </div>
          <div className="text-left min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white truncate">
                {skill.name}
              </span>
              {skill.enabled ? (
                <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
              ) : (
                <Circle className="w-3 h-3 text-white/30 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-white/40 truncate">
              {skill.commands.length} commands
            </p>
          </div>
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
            <div className="border-t border-white/5 p-3">
              <p className="text-xs text-white/50 mb-3">
                {skill.description}
              </p>

              <div className="space-y-0">
                {skill.commands.map((command) => (
                  <CommandItem
                    key={command.name}
                    command={command}
                    skillId={skill.id}
                    onExecute={onExecuteCommand}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SkillsPanel({ className, onExecuteCommand }: SkillsPanelProps) {
  const enabledCount = skillRegistry.filter((s) => s.enabled).length;

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-medium text-white">8gent Skills</span>
        </div>
        <span className="text-xs text-white/40">
          {enabledCount}/{skillRegistry.length} enabled
        </span>
      </div>

      {/* Skills list */}
      <div className="flex-1 overflow-auto p-3 space-y-2">
        {skillRegistry.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            onExecuteCommand={onExecuteCommand}
          />
        ))}
      </div>

      {/* Footer hint */}
      <div className="px-3 py-2 border-t border-white/5 bg-white/5">
        <p className="text-[10px] text-white/40 text-center">
          Click on a skill to see available commands
        </p>
      </div>
    </div>
  );
}

export default SkillsPanel;
