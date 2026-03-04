'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ControlCenterContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const ControlCenterContext = createContext<ControlCenterContextType | null>(null);

export function useControlCenter() {
  const context = useContext(ControlCenterContext);
  if (!context) {
    throw new Error('useControlCenter must be used within ControlCenterProvider');
  }
  return context;
}

interface ControlCenterProviderProps {
  children: ReactNode;
}

export function ControlCenterProvider({ children }: ControlCenterProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <ControlCenterContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </ControlCenterContext.Provider>
  );
}
