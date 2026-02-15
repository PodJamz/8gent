'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type OverlayType = 'none' | 'chat' | 'music' | 'folder';

interface OverlayContextValue {
  activeOverlay: OverlayType;
  openOverlay: (type: OverlayType) => void;
  closeOverlay: () => void;
  toggleOverlay: (type: OverlayType) => void;
  isOverlayOpen: (type: OverlayType) => boolean;
}

const OverlayContext = createContext<OverlayContextValue | null>(null);

interface OverlayProviderProps {
  children: ReactNode;
}

export function OverlayProvider({ children }: OverlayProviderProps) {
  const [activeOverlay, setActiveOverlay] = useState<OverlayType>('none');

  const openOverlay = useCallback((type: OverlayType) => {
    setActiveOverlay(type);
  }, []);

  const closeOverlay = useCallback(() => {
    setActiveOverlay('none');
  }, []);

  const toggleOverlay = useCallback((type: OverlayType) => {
    setActiveOverlay((current) => (current === type ? 'none' : type));
  }, []);

  const isOverlayOpen = useCallback(
    (type: OverlayType) => {
      return activeOverlay === type;
    },
    [activeOverlay]
  );

  const value: OverlayContextValue = {
    activeOverlay,
    openOverlay,
    closeOverlay,
    toggleOverlay,
    isOverlayOpen,
  };

  return (
    <OverlayContext.Provider value={value}>
      {children}
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error('useOverlay must be used within an OverlayProvider');
  }
  return context;
}
