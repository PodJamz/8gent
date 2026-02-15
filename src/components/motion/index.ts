// Motion Primitives - Global Animation System
// Inspired by https://motion-primitives.com

// Configuration
export {
  motionConfig,
  presets,
  containerVariants,
  createStaggerContainer,
  type PresetName,
} from './config';

// Provider
export { MotionProvider, useMotion } from './provider';

// Core Components
export { InView, type InViewProps } from './in-view';
export { TextEffect, type TextEffectProps, type TextPreset, type PerType } from './text-effect';
export { AnimatedGroup, type AnimatedGroupProps } from './animated-group';
export { FadeIn, FadeInUp, FadeInDown, FadeInBlur, FadeInScale, type FadeInProps } from './fade-in';

// Re-export motion for convenience
export { motion, AnimatePresence } from 'motion/react';
