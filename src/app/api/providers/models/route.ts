/**
 * Unified Models API Endpoint
 *
 * Aggregates models from all configured providers (Replicate, fal.ai, Gemini, WaveSpeed).
 * Uses in-memory caching to reduce external API calls.
 *
 * GET /api/providers/models
 *
 * Query params:
 *   - provider: Optional, filter to specific provider
 *   - search: Optional, search query
 *   - refresh: Optional, bypass cache if "true"
 *   - capabilities: Optional, filter by capabilities (comma-separated)
 */

import { NextRequest, NextResponse } from "next/server";
import { ProviderType, ProviderModel, ModelCapability } from "@/lib/providers/types";
import { checkRateLimit, getClientIp } from "@/lib/security";

// Simple in-memory cache (clears on server restart)
const modelCache = new Map<string, { models: ProviderModel[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Rate limit: 60 requests per minute per IP (model discovery is lightweight)
const RATE_LIMIT_CONFIG = { windowMs: 60 * 1000, maxRequests: 60 };

// Gemini image models (hardcoded)
const GEMINI_MODELS: ProviderModel[] = [
  {
    id: "nano-banana",
    name: "Nano Banana",
    description: "Fast image generation with Gemini 2.5 Flash",
    provider: "gemini",
    capabilities: ["text-to-image", "image-to-image"],
  },
  {
    id: "nano-banana-pro",
    name: "Nano Banana Pro",
    description: "High-quality image generation with Gemini 3 Pro",
    provider: "gemini",
    capabilities: ["text-to-image", "image-to-image"],
  },
];

/**
 * Fetch models from Replicate API
 */
async function fetchReplicateModels(apiKey: string): Promise<ProviderModel[]> {
  const REPLICATE_API_BASE = "https://api.replicate.com/v1";
  const allModels: ProviderModel[] = [];
  let url: string | null = `${REPLICATE_API_BASE}/models`;
  let pageCount = 0;
  const maxPages = 5; // Limit to avoid timeout

  while (url && pageCount < maxPages) {
    const response: Response = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!response.ok) {
      throw new Error(`Replicate API error: ${response.status}`);
    }

    const data: { results?: Array<{ owner: string; name: string; description: string | null; cover_image_url?: string }>; next?: string | null } = await response.json();
    if (data.results) {
      for (const model of data.results) {
        const capabilities: ModelCapability[] = [];
        const searchText = `${model.name} ${model.description ?? ""}`.toLowerCase();

        if (searchText.includes("video") || searchText.includes("animate")) {
          if (searchText.includes("img2vid") || searchText.includes("image-to-video")) {
            capabilities.push("image-to-video");
          } else {
            capabilities.push("text-to-video");
          }
        } else {
          capabilities.push("text-to-image");
          if (searchText.includes("img2img") || searchText.includes("image-to-image")) {
            capabilities.push("image-to-image");
          }
        }

        allModels.push({
          id: `${model.owner}/${model.name}`,
          name: model.name,
          description: model.description,
          provider: "replicate",
          capabilities,
          coverImage: model.cover_image_url,
        });
      }
    }
    url = data.next || null;
    pageCount++;
  }

  return allModels;
}

/**
 * Fetch models from fal.ai API
 */
async function fetchFalModels(apiKey: string | null): Promise<ProviderModel[]> {
  const FAL_API_BASE = "https://api.fal.ai/v1";
  const RELEVANT_CATEGORIES = ["text-to-image", "image-to-image", "text-to-video", "image-to-video"];

  const headers: HeadersInit = {};
  if (apiKey) {
    headers["Authorization"] = `Key ${apiKey}`;
  }

  const response: Response = await fetch(`${FAL_API_BASE}/models?status=active`, { headers });
  if (!response.ok) {
    throw new Error(`fal.ai API error: ${response.status}`);
  }

  const data: { models?: Array<{ endpoint_id: string; metadata: { display_name: string; description: string; category: string; thumbnail_url?: string } }> } = await response.json();
  if (!data.models) {
    return [];
  }
  return data.models
    .filter((m) => RELEVANT_CATEGORIES.includes(m.metadata.category))
    .map((m) => ({
      id: m.endpoint_id,
      name: m.metadata.display_name,
      description: m.metadata.description,
      provider: "fal" as ProviderType,
      capabilities: [m.metadata.category] as ModelCapability[],
      coverImage: m.metadata.thumbnail_url,
    }));
}

/**
 * Filter models by search query
 */
function filterModelsBySearch(models: ProviderModel[], query: string): ProviderModel[] {
  const searchLower = query.toLowerCase();
  return models.filter(
    (model) =>
      model.name.toLowerCase().includes(searchLower) ||
      model.description?.toLowerCase().includes(searchLower) ||
      model.id.toLowerCase().includes(searchLower)
  );
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`providers-models:${clientIp}`, RATE_LIMIT_CONFIG);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
          },
        }
      );
    }

    const providerFilter = request.nextUrl.searchParams.get("provider") as ProviderType | null;
    const searchQuery = request.nextUrl.searchParams.get("search") || undefined;
    const refresh = request.nextUrl.searchParams.get("refresh") === "true";
    const capabilitiesParam = request.nextUrl.searchParams.get("capabilities");
    const capabilitiesFilter: ModelCapability[] | null = capabilitiesParam
      ? (capabilitiesParam.split(",") as ModelCapability[])
      : null;

    // Get API keys from env
    const replicateKey = process.env.REPLICATE_API_KEY;
    const falKey = process.env.FAL_API_KEY;

    const allModels: ProviderModel[] = [];
    const providerResults: Record<string, { success: boolean; count: number; cached?: boolean; error?: string }> = {};

    // Add Gemini models
    if (!providerFilter || providerFilter === "gemini") {
      let geminiModels = GEMINI_MODELS;
      if (searchQuery) {
        geminiModels = filterModelsBySearch(geminiModels, searchQuery);
      }
      allModels.push(...geminiModels);
      providerResults["gemini"] = { success: true, count: geminiModels.length, cached: true };
    }

    // Fetch Replicate models
    if ((!providerFilter || providerFilter === "replicate") && replicateKey) {
      const cacheKey = `replicate-${searchQuery || "all"}`;
      let models: ProviderModel[] | null = null;
      let fromCache = false;

      if (!refresh) {
        const cached = modelCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          models = cached.models;
          fromCache = true;
          if (searchQuery) {
            models = filterModelsBySearch(models, searchQuery);
          }
        }
      }

      if (!models) {
        try {
          models = await fetchReplicateModels(replicateKey);
          modelCache.set(cacheKey, { models, timestamp: Date.now() });
          if (searchQuery) {
            models = filterModelsBySearch(models, searchQuery);
          }
        } catch (error) {
          providerResults["replicate"] = {
            success: false,
            count: 0,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }

      if (models) {
        allModels.push(...models);
        providerResults["replicate"] = { success: true, count: models.length, cached: fromCache };
      }
    }

    // Fetch fal.ai models
    if ((!providerFilter || providerFilter === "fal") && falKey) {
      const cacheKey = `fal-${searchQuery || "all"}`;
      let models: ProviderModel[] | null = null;
      let fromCache = false;

      if (!refresh) {
        const cached = modelCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          models = cached.models;
          fromCache = true;
        }
      }

      if (!models) {
        try {
          models = await fetchFalModels(falKey);
          modelCache.set(cacheKey, { models, timestamp: Date.now() });
          if (searchQuery) {
            models = filterModelsBySearch(models, searchQuery);
          }
        } catch (error) {
          providerResults["fal"] = {
            success: false,
            count: 0,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }

      if (models) {
        allModels.push(...models);
        providerResults["fal"] = { success: true, count: models.length, cached: fromCache };
      }
    }

    // Filter by capabilities if specified
    let filteredModels = allModels;
    if (capabilitiesFilter && capabilitiesFilter.length > 0) {
      filteredModels = allModels.filter((model) =>
        model.capabilities.some((cap) => capabilitiesFilter.includes(cap))
      );
    }

    // Sort by provider, then by name
    filteredModels.sort((a, b) => {
      if (a.provider !== b.provider) {
        return a.provider.localeCompare(b.provider);
      }
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({
      success: true,
      models: filteredModels,
      providers: providerResults,
    });
  } catch (error) {
    console.error("[Models API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
