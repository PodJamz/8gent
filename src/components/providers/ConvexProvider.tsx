'use client';

import { ReactNode } from 'react';

interface ConvexProviderProps {
  children: ReactNode;
}

export function ConvexProvider({ children }: ConvexProviderProps) {
  return (
    <>
      {children}
    </>
  );
}
