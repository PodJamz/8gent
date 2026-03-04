'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
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

interface SkillCard3DProps {
  skill: SkillDefinition;
  mode: SkillMode;
  onModeChange: (mode: SkillMode) => void;
  onSelect: () => void;
  isSelected?: boolean;
}

export function SkillCard3D({
  skill,
  mode,
  onModeChange,
  onSelect,
  isSelected = false,
}: SkillCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);

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

  const Icon = ICON_MAP[skill.icon] || Sparkles;
  const rarityInfo = RARITY_INFO[skill.rarity];

  // Rarity-based effects
  const getRarityGlow = () => {
    switch (skill.rarity) {
      case 'legendary':
        return 'shadow-[0_0_40px_rgba(251,191,36,0.4)]';
      case 'epic':
        return 'shadow-[0_0_30px_rgba(168,85,247,0.35)]';
      case 'rare':
        return 'shadow-[0_0_25px_rgba(59,130,246,0.3)]';
      case 'uncommon':
        return 'shadow-[0_0_20px_rgba(34,197,94,0.25)]';
      default:
        return 'shadow-xl';
    }
  };

  const getRarityBorder = () => {
    switch (skill.rarity) {
      case 'legendary':
        return 'border-amber-400/50';
      case 'epic':
        return 'border-purple-400/40';
      case 'rare':
        return 'border-blue-400/30';
      case 'uncommon':
        return 'border-green-400/25';
      default:
        return 'border-white/10';
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative cursor-pointer perspective-1000"
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className={`
          relative w-full aspect-[3/4] rounded-2xl overflow-hidden
          border-2 ${getRarityBorder()}
          ${isHovered ? getRarityGlow() : 'shadow-lg'}
          ${isSelected ? 'ring-2 ring-theme-primary ring-offset-2 ring-offset-zinc-950' : ''}
          transition-shadow duration-300
        `}
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${skill.gradient} opacity-90`} />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Holographic shine effect (for rare+) */}
        {skill.rarity !== 'common' && isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
            }}
          />
        )}

        {/* Rainbow shimmer for legendary */}
        {skill.rarity === 'legendary' && (
          <div className="absolute inset-0 opacity-30 pointer-events-none bg-[linear-gradient(45deg,transparent_25%,rgba(255,0,0,0.3)_30%,rgba(255,165,0,0.3)_35%,rgba(255,255,0,0.3)_40%,rgba(0,255,0,0.3)_45%,rgba(0,0,255,0.3)_50%,rgba(128,0,128,0.3)_55%,transparent_60%)] bg-[length:200%_200%] animate-shimmer" />
        )}

        {/* Card content */}
        <div className="relative z-10 h-full flex flex-col p-4" style={{ transform: 'translateZ(20px)' }}>
          {/* Header: Rarity badge */}
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${rarityInfo.color}`}>
              {rarityInfo.label}
            </span>
            <span className="text-[10px] text-white/50 uppercase tracking-wider">
              {skill.category}
            </span>
          </div>

          {/* Icon */}
          <div className="flex-1 flex items-center justify-center my-4">
            <div className="relative">
              <div className={`absolute inset-0 blur-xl bg-gradient-to-br ${skill.gradient} opacity-50`} />
              <Icon className="relative w-16 h-16 text-white drop-shadow-lg" strokeWidth={1.5} />
            </div>
          </div>

          {/* Name and description */}
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white leading-tight">
              {skill.shortName}
            </h3>
            <p className="text-[11px] text-white/70 leading-snug line-clamp-2">
              {skill.description}
            </p>
          </div>

          {/* Stats bar */}
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1">
                <span className="text-red-400">PWR</span>
                <span className="text-white/80">{skill.stats.power}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-blue-400">CPX</span>
                <span className="text-white/80">{skill.stats.complexity}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-400">UTL</span>
                <span className="text-white/80">{skill.stats.utility}</span>
              </div>
            </div>
          </div>

          {/* Mode toggle */}
          <div
            className="mt-3 flex items-center justify-center gap-1 bg-black/30 rounded-lg p-1"
            onClick={(e) => e.stopPropagation()}
          >
            {(['off', 'auto', 'on'] as SkillMode[]).map((m) => (
              <button
                key={m}
                onClick={(e) => {
                  e.stopPropagation();
                  onModeChange(m);
                }}
                className={`
                  flex-1 py-1.5 px-2 rounded-md text-[10px] font-medium uppercase tracking-wider
                  transition-all duration-200
                  ${mode === m
                    ? m === 'on'
                      ? 'bg-green-500 text-white'
                      : m === 'off'
                      ? 'bg-red-500/80 text-white'
                      : 'bg-amber-500 text-white'
                    : 'text-white/40 hover:text-white/60 hover:bg-white/5'
                  }
                `}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Corner accents for epic+ */}
        {(skill.rarity === 'epic' || skill.rarity === 'legendary') && (
          <>
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/20 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/20 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/20 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/20 rounded-br-2xl" />
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// Add shimmer animation to global CSS or use inline
const shimmerKeyframes = `
@keyframes shimmer {
  0% { background-position: 200% 200%; }
  100% { background-position: -200% -200%; }
}
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = shimmerKeyframes + '\n.animate-shimmer { animation: shimmer 3s linear infinite; }';
  if (!document.head.querySelector('[data-skill-card-styles]')) {
    style.setAttribute('data-skill-card-styles', 'true');
    document.head.appendChild(style);
  }
}
