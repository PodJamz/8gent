'use client';

import { motion } from 'framer-motion';
import {
  Users,
  Briefcase,
  GraduationCap,
  Rocket,
  User,
  LucideIcon,
} from 'lucide-react';
import type { SearchIntent } from '@/lib/humans/types';
import { INTENT_LABELS, INTENT_DESCRIPTIONS } from '@/lib/humans/types';

interface IntentCardProps {
  intent: SearchIntent;
  icon: LucideIcon;
  gradient: string;
  index: number;
  onSelect: (intent: SearchIntent) => void;
}

function IntentCard({ intent, icon: Icon, gradient, index, onSelect }: IntentCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 300 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(intent)}
      className="group relative w-full p-4 rounded-2xl text-left overflow-hidden"
      style={{
        backgroundColor: 'hsl(var(--theme-card))',
      }}
    >
      {/* Hover gradient */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${gradient}`}
      />

      {/* Border */}
      <div
        className="absolute inset-0 rounded-2xl transition-colors"
        style={{ border: '1px solid hsl(var(--theme-border) / 0.5)' }}
      />

      {/* Content */}
      <div className="relative flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-xl ${gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold text-sm mb-0.5"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          >
            {INTENT_LABELS[intent]}
          </h3>
          <p
            className="text-xs leading-relaxed"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            {INTENT_DESCRIPTIONS[intent]}
          </p>
        </div>
      </div>

      {/* Bottom accent line */}
      <motion.div
        className={`absolute bottom-0 left-0 right-0 h-0.5 ${gradient} opacity-0 group-hover:opacity-100`}
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.2 }}
        style={{ originX: 0 }}
      />
    </motion.button>
  );
}

interface IntentPickerProps {
  onSelectIntent: (intent: SearchIntent) => void;
}

export function IntentPicker({ onSelectIntent }: IntentPickerProps) {
  const intents: { intent: SearchIntent; icon: LucideIcon; gradient: string }[] = [
    {
      intent: 'collaborator',
      icon: Users,
      gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    },
    {
      intent: 'hire',
      icon: Briefcase,
      gradient: 'bg-gradient-to-br from-emerald-500 to-green-600',
    },
    {
      intent: 'expert',
      icon: GraduationCap,
      gradient: 'bg-gradient-to-br from-violet-500 to-purple-600',
    },
    {
      intent: 'founder_investor',
      icon: Rocket,
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
    },
    {
      intent: 'specific_person',
      icon: User,
      gradient: 'bg-gradient-to-br from-rose-500 to-pink-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2
          className="text-xl font-bold mb-1"
          style={{ color: 'hsl(var(--theme-foreground))' }}
        >
          Quick Find
        </h2>
        <p
          className="text-sm"
          style={{ color: 'hsl(var(--theme-muted-foreground))' }}
        >
          In case you actually need real humans for something
        </p>
      </motion.div>

      {/* Intent Cards */}
      <div className="space-y-3">
        {intents.map((item, index) => (
          <IntentCard
            key={item.intent}
            intent={item.intent}
            icon={item.icon}
            gradient={item.gradient}
            index={index}
            onSelect={onSelectIntent}
          />
        ))}
      </div>
    </div>
  );
}
