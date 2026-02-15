/**
 * Claw AI JSON Render Provider
 *
 * Provides the json-render context for Claw AI chat.
 * Wraps JSONUIProvider with our catalog and registry.
 */

'use client';

import { ReactNode } from 'react';
import { JSONUIProvider, Renderer } from '@json-render/react';
import type { UIElement, Spec } from '@json-render/core';
import { useRouter } from 'next/navigation';
import { clawAIRegistry, fallbackRenderer } from './json-render-registry';
import { isValidTheme } from '@/lib/themes/definitions';
import { useDesignThemeSafe } from '@/context/DesignThemeContext';

/**
 * UITree structure for AI-generated UI
 * Alias for Spec from @json-render/core with optional data field
 */
export interface UITree {
  root: string;
  elements: Record<string, UIElement>;
  data?: Record<string, unknown>;
  state?: Record<string, unknown>;
}

interface ClawAIJsonRenderProviderProps {
  children: ReactNode;
}

/**
 * Provider for Claw AI JSON rendering capabilities
 */
export function ClawAIJsonRenderProvider({
  children,
}: ClawAIJsonRenderProviderProps) {
  const router = useRouter();
  const { setDesignTheme } = useDesignThemeSafe();

  // Action handlers for the provider
  const actionHandlers = {
    navigate: async (params: Record<string, unknown>) => {
      const path = params.path as string;
      if (path) {
        router.push(path);
      }
    },
    openUrl: async (params: Record<string, unknown>) => {
      const url = params.url as string;
      const newTab = params.newTab as boolean;
      if (url) {
        if (newTab) {
          window.open(url, '_blank');
        } else {
          window.location.href = url;
        }
      }
    },
    showToast: async (params: Record<string, unknown>) => {
      // For now, just log - could integrate with a toast library
    },
    applyTheme: async (params: Record<string, unknown>) => {
      const themeName = params.themeName as string;
      if (themeName && isValidTheme(themeName)) {
        setDesignTheme(themeName);
      }
    },
  };

  return (
    <JSONUIProvider
      registry={clawAIRegistry}
      actionHandlers={actionHandlers}
      navigate={(path) => router.push(path)}
    >
      {children}
    </JSONUIProvider>
  );
}

interface ClawAIUIRendererProps {
  tree: UITree | null;
  loading?: boolean;
}

/**
 * Renderer component for Claw AI UI trees
 */
export function ClawAIUIRenderer({ tree, loading }: ClawAIUIRendererProps) {
  if (!tree) return null;

  // Convert UITree to Spec format (use state or data)
  const spec: Spec = {
    root: tree.root,
    elements: tree.elements,
    state: tree.state ?? tree.data,
  };

  return (
    <Renderer
      spec={spec}
      registry={clawAIRegistry}
      loading={loading}
      fallback={fallbackRenderer}
    />
  );
}

/**
 * Validate and parse a UI tree from JSON
 */
export function parseUITree(json: unknown): UITree | null {
  if (!json || typeof json !== 'object') return null;

  const tree = json as UITree;
  if (!tree.root || !tree.elements || typeof tree.elements !== 'object') {
    return null;
  }

  return tree;
}
