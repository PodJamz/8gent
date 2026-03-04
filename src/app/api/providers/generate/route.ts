/**
 * Unified Generation API Route
 *
 * Supports multi-provider image and video generation:
 * - Gemini (nano-banana, nano-banana-pro)
 * - Replicate (thousands of models)
 * - fal.ai (fast inference)
 * - WaveSpeed (when configured)
 *
 * POST /api/providers/generate
 *
 * Body:
 *   {
 *     prompt: string,
 *     provider: "gemini" | "replicate" | "fal" | "wavespeed",
 *     modelId: string,
 *     images?: string[], // Base64 data URLs for image-to-image/video
 *     parameters?: Record<string, unknown>, // Model-specific parameters
 *   }
 */

import { NextRequest, NextResponse } from "next/server";
import { ProviderType } from "@/lib/providers/types";
import { checkRateLimit, getClientIp } from "@/lib/security";

export const maxDuration = 300; // 5 minutes (Vercel limit)

// Rate limit: 20 generations per hour per IP (expensive operation)
const RATE_LIMIT_CONFIG = { windowMs: 60 * 60 * 1000, maxRequests: 20 };

const MODEL_MAP: Record<string, string> = {
  "nano-banana": "gemini-2.5-flash-image",
  "nano-banana-pro": "gemini-3-pro-image-preview",
};

interface GenerateRequest {
  prompt: string;
  provider: ProviderType;
  modelId: string;
  images?: string[];
  parameters?: Record<string, unknown>;
  aspectRatio?: string;
  resolution?: string;
  useGoogleSearch?: boolean;
}

interface GenerateResponse {
  success: boolean;
  image?: string; // Base64 data URL
  video?: string; // Base64 data URL
  videoUrl?: string; // URL for large videos
  contentType?: "image" | "video";
  error?: string;
}

/**
 * Generate with Gemini
 */
async function generateWithGemini(
  apiKey: string,
  prompt: string,
  images: string[],
  modelId: string,
  aspectRatio?: string,
  resolution?: string,
  useGoogleSearch?: boolean
): Promise<GenerateResponse> {
  const modelName = MODEL_MAP[modelId] || MODEL_MAP["nano-banana-pro"];

  const requestParts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [
    { text: prompt },
  ];

  // Add images if provided
  if (images && images.length > 0) {
    for (const image of images) {
      if (image.includes("base64,")) {
        const [header, data] = image.split("base64,");
        const mimeMatch = header.match(/data:([^;]+)/);
        const mimeType = mimeMatch ? mimeMatch[1] : "image/png";
        requestParts.push({
          inlineData: { mimeType, data },
        });
      }
    }
  }

  const requestBody: Record<string, unknown> = {
    contents: [{ role: "user", parts: requestParts }],
    generationConfig: {
      responseModalities: ["IMAGE", "TEXT"],
    },
  };

  if (aspectRatio) {
    if (!requestBody.generationConfig) {
      requestBody.generationConfig = {};
    }
    (requestBody.generationConfig as Record<string, unknown>).imageConfig = { aspectRatio };
  }

  if (modelId === "nano-banana-pro" && resolution) {
    if (!requestBody.generationConfig) {
      requestBody.generationConfig = {};
    }
    if (!(requestBody.generationConfig as Record<string, unknown>).imageConfig) {
      (requestBody.generationConfig as Record<string, unknown>).imageConfig = {};
    }
    ((requestBody.generationConfig as Record<string, unknown>).imageConfig as Record<string, unknown>).imageSize = resolution;
  }

  const tools = [];
  if (modelId === "nano-banana-pro" && useGoogleSearch) {
    tools.push({ googleSearch: {} });
  }

  if (tools.length > 0) {
    requestBody.tools = tools;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    return { success: false, error: `Gemini API error: ${errorText}` };
  }

  const data = await response.json();
  const candidates = data.candidates;
  if (!candidates || candidates.length === 0) {
    return { success: false, error: "No response from AI model" };
  }

  const parts = candidates[0].content?.parts;
  if (!parts) {
    return { success: false, error: "No content in response" };
  }

  // Find image part
  for (const part of parts) {
    if (part.inlineData && part.inlineData.data) {
      const mimeType = part.inlineData.mimeType || "image/png";
      const dataUrl = `data:${mimeType};base64,${part.inlineData.data}`;
      return {
        success: true,
        image: dataUrl,
        contentType: "image",
      };
    }
  }

  return { success: false, error: "No image in response" };
}

/**
 * Generate with Replicate
 */
async function generateWithReplicate(
  apiKey: string,
  prompt: string,
  modelId: string,
  images?: string[],
  parameters?: Record<string, unknown>
): Promise<GenerateResponse> {
  const REPLICATE_API_BASE = "https://api.replicate.com/v1";
  const [owner, name] = modelId.split("/");

  // Get model version
  const modelResponse = await fetch(`${REPLICATE_API_BASE}/models/${owner}/${name}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!modelResponse.ok) {
    return { success: false, error: `Failed to get model: ${modelResponse.status}` };
  }

  const modelData = await modelResponse.json();
  const version = modelData.latest_version?.id;
  if (!version) {
    return { success: false, error: "Model has no available version" };
  }

  // Build input
  const input: Record<string, unknown> = {
    prompt,
    ...parameters,
  };

  if (images && images.length > 0) {
    input.image = images[0]; // Replicate accepts data URLs
  }

  // Create prediction
  const createResponse = await fetch(`${REPLICATE_API_BASE}/predictions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ version, input }),
  });

  if (!createResponse.ok) {
    const errorText = await createResponse.text();
    return { success: false, error: `Replicate error: ${errorText}` };
  }

  const prediction = await createResponse.json();

  // Poll for completion
  const maxWaitTime = 5 * 60 * 1000;
  const pollInterval = 1000;
  const startTime = Date.now();

  let currentPrediction = prediction;

  while (
    currentPrediction.status !== "succeeded" &&
    currentPrediction.status !== "failed" &&
    currentPrediction.status !== "canceled"
  ) {
    if (Date.now() - startTime > maxWaitTime) {
      return { success: false, error: "Generation timed out" };
    }

    await new Promise((resolve) => setTimeout(resolve, pollInterval));

    const pollResponse = await fetch(
      `${REPLICATE_API_BASE}/predictions/${currentPrediction.id}`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    if (!pollResponse.ok) {
      return { success: false, error: `Failed to poll: ${pollResponse.status}` };
    }

    currentPrediction = await pollResponse.json();
  }

  if (currentPrediction.status === "failed") {
    return { success: false, error: currentPrediction.error || "Prediction failed" };
  }

  const output = currentPrediction.output;
  if (!output) {
    return { success: false, error: "No output" };
  }

  const outputUrls: string[] = Array.isArray(output) ? output : [output];
  if (outputUrls.length === 0) {
    return { success: false, error: "No output URLs" };
  }

  // Fetch and convert to base64
  const mediaUrl = outputUrls[0];
  const mediaResponse = await fetch(mediaUrl);
  if (!mediaResponse.ok) {
    return { success: false, error: `Failed to fetch output: ${mediaResponse.status}` };
  }

  const contentType = mediaResponse.headers.get("content-type") || "image/png";
  const isVideo = contentType.startsWith("video/");

  const mediaArrayBuffer = await mediaResponse.arrayBuffer();
  const mediaBase64 = Buffer.from(mediaArrayBuffer).toString("base64");

  if (isVideo) {
    // For large videos, return URL directly
    const sizeMB = mediaArrayBuffer.byteLength / (1024 * 1024);
    if (sizeMB > 20) {
      return {
        success: true,
        videoUrl: mediaUrl,
        contentType: "video",
      };
    }
    return {
      success: true,
      video: `data:${contentType};base64,${mediaBase64}`,
      contentType: "video",
    };
  }

  return {
    success: true,
    image: `data:${contentType};base64,${mediaBase64}`,
    contentType: "image",
  };
}

/**
 * Generate with fal.ai
 */
async function generateWithFal(
  apiKey: string | null,
  prompt: string,
  modelId: string,
  images?: string[],
  parameters?: Record<string, unknown>
): Promise<GenerateResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (apiKey) {
    headers["Authorization"] = `Key ${apiKey}`;
  }

  const requestBody: Record<string, unknown> = {
    prompt,
    ...parameters,
  };

  if (images && images.length > 0) {
    requestBody.image_url = images[0]; // fal.ai accepts data URLs
  }

  const response = await fetch(`https://fal.run/${modelId}`, {
    method: "POST",
    headers,
    body: JSON.stringify(requestBody),
    signal: AbortSignal.timeout(10 * 60 * 1000), // 10 minute timeout
  });

  if (!response.ok) {
    const errorText = await response.text();
    return { success: false, error: `fal.ai error: ${errorText}` };
  }

  const result = await response.json();

  // Extract media URL
  let mediaUrl: string | null = null;
  let isVideo = false;

  if (result.video?.url) {
    mediaUrl = result.video.url;
    isVideo = true;
  } else if (result.images?.[0]?.url) {
    mediaUrl = result.images[0].url;
  } else if (result.image?.url) {
    mediaUrl = result.image.url;
  } else if (result.output && typeof result.output === "string") {
    mediaUrl = result.output;
  }

  if (!mediaUrl) {
    return { success: false, error: "No media URL in response" };
  }

  // Fetch and convert to base64
  const mediaResponse = await fetch(mediaUrl);
  if (!mediaResponse.ok) {
    return { success: false, error: `Failed to fetch output: ${mediaResponse.status}` };
  }

  const contentType = mediaResponse.headers.get("content-type") || (isVideo ? "video/mp4" : "image/png");
  const isVideoType = contentType.startsWith("video/") || isVideo;

  const mediaArrayBuffer = await mediaResponse.arrayBuffer();
  const sizeMB = mediaArrayBuffer.byteLength / (1024 * 1024);

  // For large videos, return URL directly
  if (isVideoType && sizeMB > 20) {
    return {
      success: true,
      videoUrl: mediaUrl,
      contentType: "video",
    };
  }

  const mediaBase64 = Buffer.from(mediaArrayBuffer).toString("base64");

  if (isVideoType) {
    return {
      success: true,
      video: `data:${contentType};base64,${mediaBase64}`,
      contentType: "video",
    };
  }

  return {
    success: true,
    image: `data:${contentType};base64,${mediaBase64}`,
    contentType: "image",
  };
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`providers-generate:${clientIp}`, RATE_LIMIT_CONFIG);
    if (!rateLimit.allowed) {
      return NextResponse.json<GenerateResponse>(
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

    const body: GenerateRequest = await request.json();
    const { prompt, provider, modelId, images, parameters, aspectRatio, resolution, useGoogleSearch } = body;

    if (!prompt) {
      return NextResponse.json<GenerateResponse>(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Route to appropriate provider
    if (provider === "gemini") {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return NextResponse.json<GenerateResponse>(
          { success: false, error: "Gemini API key not configured" },
          { status: 500 }
        );
      }

      const result = await generateWithGemini(apiKey, prompt, images || [], modelId, aspectRatio, resolution, useGoogleSearch);
      return NextResponse.json(result);
    }

    if (provider === "replicate") {
      const apiKey = process.env.REPLICATE_API_KEY;
      if (!apiKey) {
        return NextResponse.json<GenerateResponse>(
          { success: false, error: "Replicate API key not configured" },
          { status: 500 }
        );
      }

      const result = await generateWithReplicate(apiKey, prompt, modelId, images, parameters);
      return NextResponse.json(result);
    }

    if (provider === "fal") {
      const apiKey = process.env.FAL_API_KEY || null; // fal.ai works without key (rate limited)

      const result = await generateWithFal(apiKey, prompt, modelId, images, parameters);
      return NextResponse.json(result);
    }

    return NextResponse.json<GenerateResponse>(
      { success: false, error: `Unsupported provider: ${provider}` },
      { status: 400 }
    );
  } catch (error) {
    console.error("[Generate API] Error:", error);
    return NextResponse.json<GenerateResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Generation failed",
      },
      { status: 500 }
    );
  }
}
