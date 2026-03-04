'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useDesignTheme } from '@/context/DesignThemeContext';
import '@/lib/themes/themes.css';

export function DesignThemeWrapper({ children }: { children: React.ReactNode }) {
  const { designTheme } = useDesignTheme();
  const { theme, setTheme } = useTheme();

  // Migrate stale "system" theme values from before enableSystem was disabled.
  // Without this, mobile users who previously had OS-driven dark mode stored as
  // "system" in localStorage would remain stuck because next-themes no longer
  // recognises "system" as a valid theme.
  useEffect(() => {
    if (theme === 'system') {
      setTheme('light');
    }
  }, [theme, setTheme]);

  // Apply theme to body element so CSS selectors [data-design-theme="..."] work globally
  // We use body (not html) because dark mode selectors use .dark [data-design-theme="..."]
  // which requires .dark (on html) to be an ANCESTOR of [data-design-theme] (on body)
  useEffect(() => {
    const body = document.body;
    body.setAttribute('data-design-theme', designTheme);

    // No cleanup needed - we want the theme to persist
  }, [designTheme]);

  // The wrapper div provides explicit theme styling as a fallback
  // and ensures the theme colors are applied even during hydration
  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: 'hsl(var(--theme-background))',
        color: 'hsl(var(--theme-foreground))',
        fontFamily: 'var(--theme-font)',
      }}
    >
      {children}
    </div>
  );
}
