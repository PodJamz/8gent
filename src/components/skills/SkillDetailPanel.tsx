'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  X,
  Globe,
  FolderOpen,
  Terminal,
  Sparkles,
  ClipboardList,
  Paintbrush,
  Layers,
  Smartphone,
  Play,
  Accessibility,
  PenTool,
  Zap,
  BookOpen,
  Layout,
  Copy,
  FlaskConical,
  Lock,
  Database,
  Code,
  Shield,
  ExternalLink,
  Package,
  Tag,
  BarChart3,
  LucideIcon,
} from 'lucide-react';
import { SkillDefinition, SkillMode, RARITY_INFO } from '@/lib/skills-registry';

// Icon mapping - data-driven, add icons here as needed for new skills
const ICON_MAP: Record<string, LucideIcon> = {
  Globe,
  FolderOpen,
  Terminal,
  Sparkles,
  ClipboardList,
  Paintbrush,
  Layers,
  Smartphone,
  Play,
  Accessibility,
  PenTool,
  Zap,
  BookOpen,
  Layout,
  Copy,
  FlaskConical,
  Lock,
  Database,
  Code,
  Shield,
  Palette: Paintbrush, // Alias for theme skills
};

interface SkillDetailPanelProps {
  skill: SkillDefinition | null;
  mode: SkillMode;
  onModeChange: (mode: SkillMode) => void;
  onClose: () => void;
}

export function SkillDetailPanel({
  skill,
  mode,
  onModeChange,
  onClose,
}: SkillDetailPanelProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation
  const springConfig = { stiffness: 100, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  // Shine effect position
  const shineX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const shineY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }, [mouseX, mouseY]);

  if (!skill) return null;

  const Icon = ICON_MAP[skill.icon] || Sparkles;
  const rarityInfo = RARITY_INFO[skill.rarity];

  // Rarity-based effects
  const getRarityGlow = () => {
    switch (skill.rarity) {
      case 'legendary':
        return 'shadow-[0_0_60px_rgba(251,191,36,0.4)]';
      case 'epic':
        return 'shadow-[0_0_50px_rgba(168,85,247,0.35)]';
      case 'rare':
        return 'shadow-[0_0_40px_rgba(59,130,246,0.3)]';
      case 'uncommon':
        return 'shadow-[0_0_30px_rgba(34,197,94,0.25)]';
      default:
        return 'shadow-2xl';
    }
  };

  const getRarityBorder = () => {
    switch (skill.rarity) {
      case 'legendary':
        return 'border-amber-400/60';
      case 'epic':
        return 'border-purple-400/50';
      case 'rare':
        return 'border-blue-400/40';
      case 'uncommon':
        return 'border-green-400/30';
      default:
        return 'border-white/20';
    }
  };

  return (
    <AnimatePresence>
      {skill && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-hidden"
          onClick={onClose}
        >
          {/* 3D Card Container */}
          <motion.div
            ref={cardRef}
            initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateX: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="relative w-[calc(100vw-2rem)] sm:w-full sm:max-w-md perspective-1000"
            style={{ perspective: 1000 }}
          >
            <motion.div
              className={`
                relative rounded-3xl overflow-hidden
                border-2 ${getRarityBorder()}
                ${getRarityGlow()}
                bg-zinc-900
              `}
              style={{
                rotateX: isHovered ? rotateX : 0,
                rotateY: isHovered ? rotateY : 0,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Holographic shine effect */}
              {skill.rarity !== 'common' && isHovered && (
                <motion.div
                  className="absolute inset-0 pointer-events-none z-20"
                  style={{
                    background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
                  }}
                />
              )}

              {/* Rainbow shimmer for legendary */}
              {skill.rarity === 'legendary' && (
                <div className="absolute inset-0 opacity-20 pointer-events-none z-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,0,0,0.3)_30%,rgba(255,165,0,0.3)_35%,rgba(255,255,0,0.3)_40%,rgba(0,255,0,0.3)_45%,rgba(0,0,255,0.3)_50%,rgba(128,0,128,0.3)_55%,transparent_60%)] bg-[length:200%_200%] animate-shimmer" />
              )}

              {/* Header gradient - taller for expanded view */}
              <div className={`h-36 bg-gradient-to-br ${skill.gradient} relative`}>
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/50 transition-colors z-30"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Icon - centered with 3D pop */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 -bottom-10"
                  style={{ transform: 'translateX(-50%) translateZ(30px)' }}
                >
                  <div className={`relative w-24 h-24 rounded-2xl bg-gradient-to-br ${skill.gradient} shadow-xl flex items-center justify-center border-4 border-zinc-900`}>
                    <div className={`absolute inset-0 blur-xl bg-gradient-to-br ${skill.gradient} opacity-50 rounded-2xl`} />
                    <Icon className="relative w-12 h-12 text-white drop-shadow-lg" strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="pt-14 px-6 pb-6 max-h-[60vh] overflow-y-auto">
                {/* Title and rarity - centered */}
                <div className="text-center mb-5">
                  <h2 className="text-2xl font-bold text-white">{skill.name}</h2>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className={`text-sm font-medium ${rarityInfo.color}`}>
                      {rarityInfo.label}
                    </span>
                    <span className="text-white/30">•</span>
                    <span className="text-sm text-white/50 capitalize">{skill.category}</span>
                  </div>
                </div>

                {/* Mode toggle - prominent at top */}
                <div className="mb-5 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-3">Skill Status</div>
                  <div className="flex items-center gap-2">
                    {(['off', 'auto', 'on'] as SkillMode[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => onModeChange(m)}
                        className={`
                          flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider
                          transition-all duration-200
                          ${mode === m
                            ? m === 'on'
                              ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                              : m === 'off'
                              ? 'bg-red-500/80 text-white shadow-lg shadow-red-500/20'
                              : 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                            : 'bg-white/5 text-white/40 hover:text-white/60 hover:bg-white/10'
                          }
                        `}
                      >
                        {m === 'auto' ? 'Auto (AI Chooses)' : m}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-white/40 mt-2 text-center">
                    {mode === 'on' && 'Skill is always active and available'}
                    {mode === 'off' && 'Skill is disabled and will not be used'}
                    {mode === 'auto' && '8gent decides when to use this skill'}
                  </p>
                </div>

                {/* Description */}
                <div className="mb-5">
                  <p className="text-sm text-white/70 leading-relaxed">{skill.longDescription}</p>
                </div>

                {/* Stats */}
                <div className="mb-5 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-4 h-4 text-white/40" />
                    <span className="text-xs text-white/40 uppercase tracking-wider">Stats</span>
                  </div>
                  <div className="space-y-2.5">
                    <StatBar label="Power" value={skill.stats.power} color="bg-red-500" />
                    <StatBar label="Complexity" value={skill.stats.complexity} color="bg-blue-500" />
                    <StatBar label="Utility" value={skill.stats.utility} color="bg-green-500" />
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-white/40" />
                    <span className="text-xs text-white/40 uppercase tracking-wider">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skill.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs text-white/60 bg-white/5 rounded-full border border-white/10"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Source */}
                {skill.source && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Source</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium text-sm">{skill.source.author}</div>
                        {skill.source.license && (
                          <div className="text-xs text-white/40">{skill.source.license} License</div>
                        )}
                      </div>
                      {skill.source.url && (
                        <a
                          href={skill.source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-theme-primary/10 text-theme-primary hover:bg-theme-primary/20 transition-colors text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>View Source</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Corner accents for epic+ */}
              {(skill.rarity === 'epic' || skill.rarity === 'legendary') && (
                <>
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white/20 rounded-tl-3xl pointer-events-none" />
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-white/20 rounded-tr-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-white/20 rounded-bl-3xl pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-white/20 rounded-br-3xl pointer-events-none" />
                </>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-white/60">{label}</span>
        <span className="text-white font-medium">{value}</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
