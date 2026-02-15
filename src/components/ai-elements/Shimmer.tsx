'use client';

import { motion } from 'framer-motion';
import { memo, useMemo, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface ShimmerProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  spread?: number;
}

/**
 * Shimmer component - Creates a shimmering text effect
 * Inspired by Polaris AI elements
 */
function ShimmerComponent({
  children,
  className,
  duration = 2,
  spread = 2,
}: ShimmerProps) {
  const text = typeof children === 'string' ? children : '';
  const dynamicSpread = useMemo(
    () => (text.length || 10) * spread,
    [text, spread]
  );

  return (
    <motion.span
      animate={{ backgroundPosition: '0% center' }}
      className={cn(
        'relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent',
        className
      )}
      initial={{ backgroundPosition: '100% center' }}
      style={
        {
          '--spread': `${dynamicSpread}px`,
          backgroundImage:
            'linear-gradient(90deg, transparent calc(50% - var(--spread)), rgba(255,255,255,0.8) 50%, transparent calc(50% + var(--spread))), linear-gradient(rgba(255,255,255,0.4), rgba(255,255,255,0.4))',
          backgroundRepeat: 'no-repeat, padding-box',
        } as CSSProperties
      }
      transition={{
        repeat: Infinity,
        duration,
        ease: 'linear',
      }}
    >
      {children}
    </motion.span>
  );
}

export const Shimmer = memo(ShimmerComponent);
Shimmer.displayName = 'Shimmer';
