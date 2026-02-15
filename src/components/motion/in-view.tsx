'use client';

import { ReactNode, useRef, useState } from 'react';
import { motion, useInView, Transition, UseInViewOptions } from 'motion/react';
import type { Variants } from 'motion/react';
import { presets, motionConfig, PresetName } from './config';

type HTMLElementTag = 'div' | 'section' | 'article' | 'main' | 'aside' | 'header' | 'footer' | 'nav' | 'span' | 'p';

export type InViewProps = {
  children: ReactNode;
  variants?: Variants;
  preset?: PresetName;
  transition?: Transition;
  viewOptions?: UseInViewOptions;
  as?: HTMLElementTag;
  once?: boolean;
  className?: string;
  delay?: number;
};

export function InView({
  children,
  variants,
  preset = 'fadeUp',
  transition,
  viewOptions,
  as = 'div',
  once = true,
  className,
  delay = 0,
}: InViewProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, ...viewOptions });
  const [hasViewed, setHasViewed] = useState(false);

  const selectedVariants = variants || presets[preset];

  const MotionComponent = motion[as as keyof typeof motion] as React.ComponentType<{
    ref: React.RefObject<null>;
    initial: string;
    animate: string;
    variants: Variants;
    transition: Transition;
    className?: string;
    onAnimationComplete?: () => void;
    children: ReactNode;
  }>;

  return (
    <MotionComponent
      ref={ref}
      initial="hidden"
      animate={isInView || hasViewed ? 'visible' : 'hidden'}
      variants={selectedVariants}
      transition={{
        ...motionConfig.transition,
        delay,
        ...transition,
      }}
      className={className}
      onAnimationComplete={() => {
        if (once && isInView) setHasViewed(true);
      }}
    >
      {children}
    </MotionComponent>
  );
}
