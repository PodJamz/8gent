'use client';

import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AppIconProps {
  name: string;
  href?: string;
  icon?: React.ReactNode;
  imageUrl?: string;
  gradient: string;
  delay?: number;
  external?: boolean;
  onClick?: () => void;
}

// Store transition origin for page animations
export const APP_TRANSITION_KEY = 'openclaw_appTransition';

export function AppIcon({ name, href, icon, imageUrl, gradient, delay = 0, external, onClick }: AppIconProps) {
  const iconRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();

    // Custom onClick handler (e.g., for 8gent chat)
    if (onClick) {
      onClick();
      return;
    }

    // External links open in new tab
    if (external && href) {
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }

    // Internal navigation with transition
    if (href) {
      if (iconRef.current) {
        const rect = iconRef.current.getBoundingClientRect();
        const transitionData = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height,
          gradient,
          timestamp: Date.now(),
        };
        sessionStorage.setItem(APP_TRANSITION_KEY, JSON.stringify(transitionData));
      }
      router.push(href);
    }
  }, [href, gradient, router, external, onClick]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay,
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-2"
    >
      <div
        ref={iconRef}
        onClick={handleClick}
        className="block cursor-pointer"
      >
        <div
          className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-[18px] sm:rounded-[20px] flex items-center justify-center shadow-lg relative overflow-hidden"
          style={{ background: imageUrl ? 'transparent' : gradient }}
        >
          {imageUrl ? (
            /* Custom image icon */
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              {/* Glass overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

              {/* Icon */}
              <div className="relative z-10 text-white">
                {icon}
              </div>
            </>
          )}
        </div>
      </div>
      <span className="text-white/90 text-xs font-medium text-center max-w-[72px] truncate">
        {name}
      </span>
    </motion.div>
  );
}

// Custom SVG Icons with iOS-style aesthetics
export const AppIcons = {
  // Story icon - open book
  Story: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 8C6 6.89543 6.89543 6 8 6H14C15.1046 6 16 6.89543 16 8V26C16 26 14 24 10 24C6 24 6 26 6 26V8Z"
        fill="white"
        fillOpacity="0.9"
      />
      <path
        d="M26 8C26 6.89543 25.1046 6 24 6H18C16.8954 6 16 6.89543 16 8V26C16 26 18 24 22 24C26 24 26 26 26 26V8Z"
        fill="white"
        fillOpacity="0.7"
      />
      <path d="M9 11H13M9 15H13M9 19H11" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M19 11H23M19 15H23M21 19H23" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  // Design icon - palette/brush
  Design: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="11" fill="white" fillOpacity="0.9" />
      <circle cx="12" cy="11" r="2.5" fill="#FF6B6B" />
      <circle cx="20" cy="11" r="2.5" fill="#4ECDC4" />
      <circle cx="11" cy="18" r="2.5" fill="#45B7D1" />
      <circle cx="19" cy="19" r="2.5" fill="#96CEB4" />
      <circle cx="16" cy="16" r="3" fill="white" />
    </svg>
  ),

  // Resume icon - document with person
  Resume: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="4" width="18" height="24" rx="2" fill="white" fillOpacity="0.9" />
      <circle cx="16" cy="12" r="4" fill="currentColor" fillOpacity="0.2" />
      <path
        d="M10 24C10 20.6863 12.6863 18 16 18C19.3137 18 22 20.6863 22 24"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),

  // Music icon - note with waves
  Music: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="22" r="4" fill="white" fillOpacity="0.9" />
      <circle cx="23" cy="19" r="4" fill="white" fillOpacity="0.7" />
      <path d="M15 22V8L27 5V19" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 12C7 10 9 10 11 12" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 16C6 13 8 13 11 16" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  // Jamz Studio icon - DAW waveform with mixing board aesthetic
  Jamz: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main waveform bars */}
      <rect x="4" y="14" width="3" height="8" rx="1.5" fill="white" fillOpacity="0.9" />
      <rect x="9" y="10" width="3" height="16" rx="1.5" fill="white" fillOpacity="0.85" />
      <rect x="14" y="6" width="3" height="24" rx="1.5" fill="white" fillOpacity="0.95" />
      <rect x="19" y="11" width="3" height="14" rx="1.5" fill="white" fillOpacity="0.8" />
      <rect x="24" y="13" width="3" height="10" rx="1.5" fill="white" fillOpacity="0.9" />
      {/* Mixing knob accents */}
      <circle cx="7" cy="26" r="2" fill="white" fillOpacity="0.6" />
      <circle cx="16" cy="26" r="2" fill="white" fillOpacity="0.6" />
      <circle cx="25" cy="26" r="2" fill="white" fillOpacity="0.6" />
      {/* Top accent line */}
      <path d="M4 4H28" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  // Vault icon - lock with shield
  Vault: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 4L6 8V14C6 21.732 10.268 27.268 16 28C21.732 27.268 26 21.732 26 14V8L16 4Z"
        fill="white"
        fillOpacity="0.9"
      />
      <rect x="12" y="14" width="8" height="8" rx="1" fill="currentColor" fillOpacity="0.25" />
      <path d="M14 14V12C14 10.8954 14.8954 10 16 10C17.1046 10 18 10.8954 18 12V14" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="18" r="1" fill="currentColor" fillOpacity="0.4" />
    </svg>
  ),

  // Blog icon - pencil with lines
  Blog: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="20" height="20" rx="3" fill="white" fillOpacity="0.9" />
      <path d="M10 12H22" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 16H22" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 20H17" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M20 17L24 13L27 16L23 20L20 21L20 17Z"
        fill="#FFB347"
        stroke="#FFB347"
        strokeWidth="0.5"
      />
    </svg>
  ),

  // Lab icon - beaker with bubbles
  Lab: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 6H20V12L26 26H6L12 12V6Z"
        fill="white"
        fillOpacity="0.9"
      />
      <path d="M12 6H20" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M9 20H23L26 26H6L9 20Z"
        fill="#A78BFA"
        fillOpacity="0.5"
      />
      <circle cx="12" cy="22" r="1.5" fill="white" fillOpacity="0.8" />
      <circle cx="16" cy="23" r="1" fill="white" fillOpacity="0.6" />
      <circle cx="19" cy="21" r="1.5" fill="white" fillOpacity="0.7" />
    </svg>
  ),

  // Settings icon - gear
  Settings: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 6L18.5 8.5L22 8L24 12L22 14.5V17.5L24 20L22 24L18.5 23.5L16 26L13.5 23.5L10 24L8 20L10 17.5V14.5L8 12L10 8L13.5 8.5L16 6Z"
        fill="white"
        fillOpacity="0.9"
      />
      <circle cx="16" cy="16" r="4" fill="currentColor" fillOpacity="0.2" />
    </svg>
  ),

  // Humans icon - people silhouettes for people search
  Humans: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main person in center */}
      <circle cx="16" cy="10" r="4" fill="white" fillOpacity="0.95" />
      <path
        d="M10 24C10 20.134 12.686 17 16 17C19.314 17 22 20.134 22 24"
        stroke="white"
        strokeOpacity="0.95"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Person on left */}
      <circle cx="7" cy="12" r="2.5" fill="white" fillOpacity="0.6" />
      <path
        d="M3 22C3 19.5 4.8 17.5 7 17.5C9.2 17.5 11 19.5 11 22"
        stroke="white"
        strokeOpacity="0.5"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Person on right */}
      <circle cx="25" cy="12" r="2.5" fill="white" fillOpacity="0.6" />
      <path
        d="M21 22C21 19.5 22.8 17.5 25 17.5C27.2 17.5 29 19.5 29 22"
        stroke="white"
        strokeOpacity="0.5"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Search magnifier accent */}
      <circle cx="24" cy="8" r="3" stroke="white" strokeOpacity="0.8" strokeWidth="1.5" fill="none" />
      <path d="M26.5 10.5L28.5 12.5" stroke="white" strokeOpacity="0.8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  // Canvas icon - infinite canvas with shapes and grid
  Canvas: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Grid background suggesting infinite canvas */}
      <rect x="4" y="4" width="24" height="24" rx="3" fill="white" fillOpacity="0.15" />
      {/* Grid lines */}
      <path d="M10 4V28M16 4V28M22 4V28" stroke="white" strokeOpacity="0.2" strokeWidth="0.5" />
      <path d="M4 10H28M4 16H28M4 22H28" stroke="white" strokeOpacity="0.2" strokeWidth="0.5" />
      {/* Creative shapes on canvas */}
      <rect x="7" y="7" width="6" height="6" rx="1" fill="white" fillOpacity="0.9" />
      <circle cx="22" cy="10" r="4" fill="white" fillOpacity="0.8" />
      <path d="M8 19L12 25H4L8 19Z" fill="white" fillOpacity="0.85" />
      {/* Connection line suggesting flow */}
      <path d="M13 10H18" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
      <path d="M12 22L18 15" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
      {/* Sticky note / text block */}
      <rect x="17" y="17" width="9" height="7" rx="1" fill="white" fillOpacity="0.9" />
      <path d="M19 20H24M19 23H22" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" strokeLinecap="round" />
      {/* Pencil cursor accent */}
      <path d="M25 5L27 7L24 10L22 8L25 5Z" fill="#FFB347" />
    </svg>
  ),
};

// Gradient presets for icons - uses theme variables where appropriate
export const AppGradients = {
  story: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  design: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  resume: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  music: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  // Jamz uses theme gradient for consistency
  jamz: 'linear-gradient(135deg, hsl(var(--theme-primary, 262 83% 58%)) 0%, hsl(var(--theme-accent, 187 94% 43%)) 100%)',
  vault: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  blog: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  lab: 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
  // Settings uses theme gradient
  settings: 'linear-gradient(135deg, hsl(var(--theme-primary, 262 83% 58%)) 0%, hsl(var(--theme-accent, 187 94% 43%)) 100%)',
  claude: 'linear-gradient(135deg, #D97757 0%, #B8523A 100%)',
  chatgpt: 'linear-gradient(135deg, #74AA9C 0%, #5A9086 100%)',
  humans: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
  // Canvas - purple to cyan for creative/infinite feel
  canvas: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
};

// Custom image URLs for app icons
export const AppImages = {
  story: '/storyapp.svg',
  design: '/designapp.svg',
  resume: '/resumeapp.svg',
  music: '/musicapp.svg',
  vault: '/vaultapp.svg',
  blog: '/blogapp.svg',
  claude: '/claudeapp.svg',
  chatgpt: '/chatgptapp.svg',
};
