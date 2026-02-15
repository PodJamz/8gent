'use client';

import { ReactNode } from 'react';
import { motion, Transition } from 'motion/react';
import { presets, motionConfig, PresetName } from './config';
import { cn } from '@/lib/utils';

type HTMLElementTag = 'div' | 'section' | 'article' | 'main' | 'aside' | 'header' | 'footer' | 'nav' | 'span' | 'p';

export type FadeInProps = {
  children: ReactNode;
  className?: string;
  preset?: PresetName;
  delay?: number;
  duration?: number;
  as?: HTMLElementTag;
  transition?: Transition;
};

export function FadeIn({
  children,
  className,
  preset = 'fade',
  delay = 0,
  duration = motionConfig.duration.normal,
  as = 'div',
  transition,
}: FadeInProps) {
  const selectedVariants = presets[preset];
  const MotionComponent = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionComponent
      initial="hidden"
      animate="visible"
      variants={selectedVariants}
      transition={{
        duration,
        delay,
        ease: motionConfig.ease.smooth,
        ...transition,
      }}
      className={cn(className)}
    >
      {children}
    </MotionComponent>
  );
}

// Preset exports for convenience
export function FadeInUp(props: Omit<FadeInProps, 'preset'>) {
  return <FadeIn {...props} preset="fadeUp" />;
}

export function FadeInDown(props: Omit<FadeInProps, 'preset'>) {
  return <FadeIn {...props} preset="fadeDown" />;
}

export function FadeInBlur(props: Omit<FadeInProps, 'preset'>) {
  return <FadeIn {...props} preset="blur" />;
}

export function FadeInScale(props: Omit<FadeInProps, 'preset'>) {
  return <FadeIn {...props} preset="scale" />;
}
