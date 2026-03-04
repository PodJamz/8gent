'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { ThemeName, isValidTheme } from '@/lib/themes';

interface DesignThemeContextType {
  designTheme: ThemeName;
  setDesignTheme: (theme: ThemeName) => void;
  // Aliases for convenience
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const DesignThemeContext = createContext<DesignThemeContextType | null>(null);

const STORAGE_KEY = 'design-theme';
const DEFAULT_THEME: ThemeName = 'base';

export function DesignThemeProvider({ children }: { children: ReactNode }) {
  const [designTheme, setDesignThemeState] = useState<ThemeName>(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isValidTheme(stored)) {
      setDesignThemeState(stored);
    }
  }, []);

  const setDesignTheme = useCallback((theme: ThemeName) => {
    setDesignThemeState(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, []);

  const value: DesignThemeContextType = {
    designTheme,
    setDesignTheme,
    // Aliases
    theme: designTheme,
    setTheme: setDesignTheme,
  };

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) {
    return (
      <DesignThemeContext.Provider value={{ ...value, designTheme: DEFAULT_THEME, theme: DEFAULT_THEME }}>
        {children}
      </DesignThemeContext.Provider>
    );
  }

  return (
    <DesignThemeContext.Provider value={value}>
      {children}
    </DesignThemeContext.Provider>
  );
}

export function useDesignTheme() {
  const context = useContext(DesignThemeContext);
  if (!context) {
    throw new Error('useDesignTheme must be used within a DesignThemeProvider');
  }
  return context;
}

// Safe version that returns defaults instead of throwing - use for pages that might
// render before the provider is fully initialized during client-side navigation
export function useDesignThemeSafe() {
  const context = useContext(DesignThemeContext);
  if (!context) {
    // Return safe defaults
    return {
      designTheme: DEFAULT_THEME,
      theme: DEFAULT_THEME,
      setDesignTheme: () => {},
      setTheme: () => {},
    };
  }
  return context;
}
