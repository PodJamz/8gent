'use client';

import { ReactNode, useMemo } from 'react';
import { motion, Variants } from 'motion/react';
import React from 'react';
import { presets, motionConfig, PresetName } from './config';

type HTMLElementTag = 'div' | 'section' | 'article' | 'main' | 'aside' | 'header' | 'footer' | 'nav' | 'ul' | 'ol' | 'li' | 'span' | 'p';

export type AnimatedGroupProps = {
  children: ReactNode;
  className?: string;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
  preset?: PresetName;
  as?: HTMLElementTag;
  asChild?: HTMLElementTag;
  stagger?: number;
  delay?: number;
};

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: motionConfig.stagger.normal,
    },
  },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export function AnimatedGroup({
  children,
  className,
  variants,
  preset = 'fadeUp',
  as = 'div',
  asChild = 'div',
  stagger = motionConfig.stagger.normal,
  delay = 0,
}: AnimatedGroupProps) {
  const selectedPreset = presets[preset];

  const containerVariants: Variants = variants?.container || {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const itemVariants: Variants = variants?.item || {
    hidden: { ...defaultItemVariants.hidden, ...selectedPreset.hidden },
    visible: { ...defaultItemVariants.visible, ...selectedPreset.visible },
  };

  const MotionComponent = useMemo(
    () => motion[as as keyof typeof motion] as typeof motion.div,
    [as]
  );

  const MotionChild = useMemo(
    () => motion[asChild as keyof typeof motion] as typeof motion.div,
    [asChild]
  );

  return (
    <MotionComponent
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <MotionChild key={index} variants={itemVariants}>
          {child}
        </MotionChild>
      ))}
    </MotionComponent>
  );
}
