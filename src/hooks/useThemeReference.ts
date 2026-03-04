'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Hook to handle theme reference to 8gent
 *
 * This provides functionality to send theme context to the AI assistant,
 * either by navigating to the prototyping page with the theme context,
 * or by storing the context for later use.
 */
export function useThemeReference() {
  const router = useRouter();

  /**
   * Navigate to prototyping page with theme reference
   */
  const navigateToPrototypingWithTheme = useCallback((themePrompt: string) => {
    // Store the theme reference in sessionStorage for the prototyping page to pick up
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ai_james_theme_reference', themePrompt);
      sessionStorage.setItem('ai_james_theme_reference_timestamp', Date.now().toString());
    }
    router.push('/prototyping?theme_ref=true');
  }, [router]);

  /**
   * Store theme reference for later use (without navigation)
   */
  const storeThemeReference = useCallback((themePrompt: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ai_james_theme_reference', themePrompt);
      sessionStorage.setItem('ai_james_theme_reference_timestamp', Date.now().toString());
    }
  }, []);

  /**
   * Get stored theme reference
   */
  const getStoredThemeReference = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;

    const reference = sessionStorage.getItem('ai_james_theme_reference');
    const timestamp = sessionStorage.getItem('ai_james_theme_reference_timestamp');

    // Check if reference is recent (within 5 minutes)
    if (reference && timestamp) {
      const age = Date.now() - parseInt(timestamp, 10);
      if (age < 5 * 60 * 1000) { // 5 minutes
        return reference;
      }
      // Clear stale reference
      sessionStorage.removeItem('ai_james_theme_reference');
      sessionStorage.removeItem('ai_james_theme_reference_timestamp');
    }

    return null;
  }, []);

  /**
   * Clear stored theme reference
   */
  const clearThemeReference = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('ai_james_theme_reference');
      sessionStorage.removeItem('ai_james_theme_reference_timestamp');
    }
  }, []);

  /**
   * Open theme reference in a new chat message
   * This is for when you want to inject the theme context into an existing chat
   */
  const injectThemeIntoChat = useCallback((themePrompt: string): string => {
    // Format the prompt for chat injection
    return `I'd like to use this design system for my project:\n\n${themePrompt}\n\nPlease acknowledge and let me know you understand the theme. I'll describe what I want to build next.`;
  }, []);

  return {
    navigateToPrototypingWithTheme,
    storeThemeReference,
    getStoredThemeReference,
    clearThemeReference,
    injectThemeIntoChat,
  };
}

export default useThemeReference;
