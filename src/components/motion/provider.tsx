'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';
import { LazyMotion, domAnimation, MotionConfig } from 'motion/react';
import { motionConfig } from './config';

type MotionContextValue = {
  reducedMotion: boolean;
  config: typeof motionConfig;
};

const MotionContext = createContext<MotionContextValue>({
  reducedMotion: false,
  config: motionConfig,
});

export function useMotion() {
  return useContext(MotionContext);
}

type MotionProviderProps = {
  children: ReactNode;
  reducedMotion?: boolean;
};

export function MotionProvider({
  children,
  reducedMotion = false,
}: MotionProviderProps) {
  const value = useMemo(
    () => ({
      reducedMotion,
      config: motionConfig,
    }),
    [reducedMotion]
  );

  return (
    <MotionContext.Provider value={value}>
      <LazyMotion features={domAnimation}>
        <MotionConfig
          reducedMotion={reducedMotion ? 'always' : 'user'}
          transition={motionConfig.transition}
        >
          {children}
        </MotionConfig>
      </LazyMotion>
    </MotionContext.Provider>
  );
}
