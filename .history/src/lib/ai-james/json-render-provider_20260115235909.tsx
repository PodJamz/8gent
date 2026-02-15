/**
 * AI James JSON Render Provider
 *
 * Provides the json-render context for AI James chat.
 * Wraps JSONUIProvider with our catalog and registry.
 */

'use client';

import { ReactNode } from 'react';
import { JSONUIProvider, Renderer } from '@json-render/react';
import type { UITree } from '@json-render/core';
import { useRouter } from 'next/navigation';
import { aiJamesRegistry, fallbackRenderer } from './json-render-registry';

interface AiJamesJsonRenderProviderProps {
  children: ReactNode;
  initialData?: Record<string, unknown>;
  onDataChange?: (path: string, value: unknown) => void;
}

/**
 * Provider for AI James JSON rendering capabilities
 */
export function AiJamesJsonRenderProvider({
  children,
  initialData = {},
  onDataChange,
}: AiJamesJsonRenderProviderProps) {
  const router = useRouter();

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
  };

  return (
    <JSONUIProvider
      registry={aiJamesRegistry}
      initialData={initialData}
      actionHandlers={actionHandlers}
      navigate={(path) => router.push(path)}
      onDataChange={onDataChange}
    >
      {children}
    </JSONUIProvider>
  );
}

interface AiJamesUIRendererProps {
  tree: UITree | null;
  loading?: boolean;
}

/**
 * Renderer component for AI James UI trees
 */
export function AiJamesUIRenderer({ tree, loading }: AiJamesUIRendererProps) {
  if (!tree) return null;

  return (
    <Renderer
      tree={tree}
      registry={aiJamesRegistry}
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
