/**
 * Provider Registry and Factory
 *
 * Central registry for AI provider implementations. Providers register themselves
 * when their modules are imported, enabling dynamic provider discovery.
 *
 * Usage:
 *   import { getProvider, getConfiguredProviders } from "@/lib/providers";
 *
 *   // Get a specific provider
 *   const replicate = getProvider("replicate");
 *
 *   // Get all providers with API keys configured
 *   const available = getConfiguredProviders();
 */

import { ProviderType } from "./types";
import { ProviderInterface, ProviderModel } from "./types";

/**
 * Provider registry - populated by provider implementations when they are imported.
 * Initially empty; providers call registerProvider() to add themselves.
 */
const providerRegistry: Partial<Record<ProviderType, ProviderInterface>> = {};

/**
 * Register a provider implementation in the registry.
 * Called by provider modules when they are imported.
 *
 * @param provider - The provider implementation to register
 */
export function registerProvider(provider: ProviderInterface): void {
  providerRegistry[provider.id] = provider;
}

/**
 * Get a provider by its type identifier.
 *
 * @param id - The provider type (e.g., "replicate", "fal")
 * @returns The provider implementation or undefined if not registered
 */
export function getProvider(id: ProviderType): ProviderInterface | undefined {
  return providerRegistry[id];
}

/**
 * Get all providers that have API keys configured.
 * Useful for showing available options in the UI.
 *
 * @returns Array of configured provider implementations
 */
export function getConfiguredProviders(): ProviderInterface[] {
  return Object.values(providerRegistry).filter(
    (p): p is ProviderInterface => p !== undefined && p.isConfigured()
  );
}

/**
 * Get all registered providers regardless of configuration status.
 * Useful for settings UI where users can configure API keys.
 *
 * @returns Array of all registered provider implementations
 */
export function getAllProviders(): ProviderInterface[] {
  return Object.values(providerRegistry).filter(
    (p): p is ProviderInterface => p !== undefined
  );
}

/**
 * API keys object for multi-provider operations.
 * Keys are provider IDs, values are API keys.
 */
export interface ApiKeys {
  replicate?: string;
  fal?: string;
  wavespeed?: string;
  gemini?: string;
  openai?: string;
}

/**
 * List models from all registered providers.
 *
 * @param apiKeys - API keys object (for server-side usage)
 * @returns Combined array of models from all registered providers
 */
export async function listAllModels(
  apiKeys: ApiKeys = {}
): Promise<ProviderModel[]> {
  const providers = getAllProviders();
  const results = await Promise.allSettled(
    providers.map((p) => p.listModels())
  );

  const allModels: ProviderModel[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      allModels.push(...result.value);
    }
  }

  // Sort by provider, then by name
  allModels.sort((a, b) => {
    if (a.provider !== b.provider) {
      return a.provider.localeCompare(b.provider);
    }
    return a.name.localeCompare(b.name);
  });

  return allModels;
}

/**
 * Search for models across all registered providers.
 *
 * @param query - Search query string
 * @param apiKeys - API keys object (for server-side usage)
 * @returns Combined array of matching models from all registered providers
 */
export async function searchAllModels(
  query: string,
  apiKeys: ApiKeys = {}
): Promise<ProviderModel[]> {
  const providers = getAllProviders();
  const results = await Promise.allSettled(
    providers.map((p) => p.searchModels(query))
  );

  const allModels: ProviderModel[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      allModels.push(...result.value);
    }
  }

  // Sort by provider, then by name
  allModels.sort((a, b) => {
    if (a.provider !== b.provider) {
      return a.provider.localeCompare(b.provider);
    }
    return a.name.localeCompare(b.name);
  });

  return allModels;
}

// Re-export types for convenient imports
export * from "./types";
