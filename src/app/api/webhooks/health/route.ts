/**
 * Apple Health Webhook Handler
 *
 * Receives health data from iOS Shortcuts and stores it in Convex.
 *
 * Flow:
 * 1. iOS Shortcut collects health data via "Find Health Samples"
 * 2. Shortcut sends POST request with JSON payload
 * 3. This endpoint validates API key and ingests data
 * 4. Daily summaries are updated automatically
 *
 * Authentication:
 * - API key in Authorization header: "Bearer jh_xxxxx"
 * - Keys are generated via Convex mutation (generateApiKey)
 *
 * Expected payload:
 * {
 *   "date": "2026-02-02",
 *   "samples": [
 *     { "type": "steps", "value": 8432, "unit": "count" },
 *     { "type": "heartRate", "value": 72, "unit": "bpm", "aggregation": "average" },
 *     ...
 *   ]
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "@/lib/openclaw/client";
import { api } from '@/lib/convex-shim';
import crypto from "crypto";

// =============================================================================
// Configuration
// =============================================================================

function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL not configured");
  }
  return new ConvexHttpClient(url);
}

// Rate limiting (simple in-memory, resets on redeploy)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 60; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

// =============================================================================
// Types
// =============================================================================

interface HealthSampleInput {
  type: string;
  value: number;
  unit: string;
  aggregation?: "sum" | "average" | "min" | "max" | "latest" | "duration";
  startDate?: string; // ISO date or Unix timestamp
  endDate?: string;
  source?: string;
  // Workout-specific
  workoutType?: string;
  workoutDuration?: number;
  workoutCalories?: number;
  workoutDistance?: number;
  // Sleep-specific
  sleepStage?: "inBed" | "asleep" | "awake" | "rem" | "core" | "deep";
  // Extra metadata
  metadata?: Record<string, unknown>;
}

interface HealthPayload {
  date?: string; // Default date for samples (YYYY-MM-DD)
  samples: HealthSampleInput[];
}

// Valid sample types
const VALID_SAMPLE_TYPES = [
  "steps",
  "distance",
  "activeEnergy",
  "basalEnergy",
  "flightsClimbed",
  "exerciseMinutes",
  "standHours",
  "heartRate",
  "restingHeartRate",
  "heartRateVariability",
  "walkingHeartRate",
  "sleepAnalysis",
  "timeInBed",
  "weight",
  "bodyFat",
  "bodyMass",
  "height",
  "bloodOxygen",
  "respiratoryRate",
  "bodyTemperature",
  "bloodPressureSystolic",
  "bloodPressureDiastolic",
  "bloodGlucose",
  "mindfulMinutes",
  "workout",
];

// =============================================================================
// API Key Validation
// =============================================================================

async function validateApiKey(
  apiKey: string,
  convex: ConvexHttpClient
): Promise<{ valid: boolean; ownerId?: string; error?: string }> {
  try {
    // Hash the provided key
    const keyHash = crypto.createHash("sha256").update(apiKey).digest("hex");

    // Look up by hash using a public query
    // Note: Using type assertion because health module types are generated at deploy time
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const healthApi = (api as unknown as { health: { validateApiKeyPublic: any } }).health;
    const result = await convex.query(
      healthApi.validateApiKeyPublic,
      { keyHash }
    ) as { valid: boolean; ownerId?: string; error?: string };

    return result;
  } catch (error) {
    console.error("[Health Webhook] API key validation error:", error);
    return { valid: false, error: "Validation failed" };
  }
}

// =============================================================================
// Request Handlers
// =============================================================================

/**
 * POST /api/webhooks/health
 *
 * Receive health data from iOS Shortcuts.
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Extract API key from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid Authorization header" },
        { status: 401 }
      );
    }

    const apiKey = authHeader.slice(7); // Remove "Bearer " prefix

    // Rate limiting by API key prefix (don't want to hash on every request)
    const keyPrefix = apiKey.slice(0, 16);
    if (!checkRateLimit(keyPrefix)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 }
      );
    }

    // Parse request body
    let payload: HealthPayload;
    try {
      payload = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    // Validate payload structure
    if (!payload.samples || !Array.isArray(payload.samples)) {
      return NextResponse.json(
        { error: "Missing or invalid 'samples' array" },
        { status: 400 }
      );
    }

    if (payload.samples.length === 0) {
      return NextResponse.json(
        { error: "No samples provided" },
        { status: 400 }
      );
    }

    if (payload.samples.length > 500) {
      return NextResponse.json(
        { error: "Too many samples. Maximum 500 per request." },
        { status: 400 }
      );
    }

    // Validate API key
    const convex = getConvexClient();
    const validation = await validateApiKey(apiKey, convex);

    if (!validation.valid || !validation.ownerId) {
      return NextResponse.json(
        { error: validation.error || "Invalid API key" },
        { status: 401 }
      );
    }

    // Process and validate samples
    const defaultDate = payload.date || new Date().toISOString().split("T")[0];
    const processedSamples: Array<{
      sampleType: string;
      value: number;
      unit: string;
      startDate: number;
      endDate: number;
      aggregationType?: "sum" | "average" | "min" | "max" | "latest" | "duration";
      sourceName?: string;
      workoutType?: string;
      workoutDuration?: number;
      workoutCalories?: number;
      workoutDistance?: number;
      sleepStage?: "inBed" | "asleep" | "awake" | "rem" | "core" | "deep";
      metadata?: string;
    }> = [];

    const validationErrors: string[] = [];

    for (let i = 0; i < payload.samples.length; i++) {
      const sample = payload.samples[i];

      // Validate sample type
      if (!VALID_SAMPLE_TYPES.includes(sample.type)) {
        validationErrors.push(
          `Sample ${i}: Invalid type '${sample.type}'. Valid types: ${VALID_SAMPLE_TYPES.join(", ")}`
        );
        continue;
      }

      // Validate value
      if (typeof sample.value !== "number" || isNaN(sample.value)) {
        validationErrors.push(`Sample ${i}: Invalid value '${sample.value}'`);
        continue;
      }

      // Parse dates
      let startDate: number;
      let endDate: number;

      if (sample.startDate) {
        startDate =
          typeof sample.startDate === "number"
            ? sample.startDate
            : new Date(sample.startDate).getTime();
      } else {
        // Use default date at midnight
        startDate = new Date(`${defaultDate}T00:00:00Z`).getTime();
      }

      if (sample.endDate) {
        endDate =
          typeof sample.endDate === "number"
            ? sample.endDate
            : new Date(sample.endDate).getTime();
      } else {
        // End date same as start for point-in-time measurements
        endDate = startDate;
      }

      if (isNaN(startDate) || isNaN(endDate)) {
        validationErrors.push(`Sample ${i}: Invalid date format`);
        continue;
      }

      processedSamples.push({
        sampleType: sample.type,
        value: sample.value,
        unit: sample.unit || "unknown",
        startDate,
        endDate,
        aggregationType: sample.aggregation,
        sourceName: sample.source,
        workoutType: sample.workoutType,
        workoutDuration: sample.workoutDuration,
        workoutCalories: sample.workoutCalories,
        workoutDistance: sample.workoutDistance,
        sleepStage: sample.sleepStage,
        metadata: sample.metadata ? JSON.stringify(sample.metadata) : undefined,
      });
    }

    if (processedSamples.length === 0) {
      return NextResponse.json(
        {
          error: "No valid samples to process",
          validationErrors,
        },
        { status: 400 }
      );
    }

    // Generate sync ID
    const syncId = `sync_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    // Get client info
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Ingest samples via Convex mutation
    // Note: Using type assertion because health module types are generated at deploy time
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const healthMutations = (api as unknown as {
      health: {
        ingestHealthSamplesPublic: any;
        updateDailySummaryPublic: any;
      };
    }).health;

    const result = await convex.mutation(
      healthMutations.ingestHealthSamplesPublic,
      {
        ownerId: validation.ownerId,
        syncId,
        samples: processedSamples,
        ipAddress,
        userAgent,
      }
    ) as { success: boolean; samplesReceived: number; samplesStored: number; errors?: string[] };

    // Update daily summaries for affected dates
    const affectedDates = new Set(
      processedSamples.map(
        (s) => new Date(s.startDate).toISOString().split("T")[0]
      )
    );

    for (const date of affectedDates) {
      try {
        await convex.mutation(
          healthMutations.updateDailySummaryPublic,
          {
            ownerId: validation.ownerId,
            date,
          }
        );
      } catch (error) {
        console.error(
          `[Health Webhook] Failed to update summary for ${date}:`,
          error
        );
      }
    }

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      syncId,
      samplesReceived: payload.samples.length,
      samplesStored: result.samplesStored,
      validationErrors:
        validationErrors.length > 0 ? validationErrors : undefined,
      processingTimeMs: duration,
    });
  } catch (error) {
    console.error("[Health Webhook] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/webhooks/health
 *
 * Health check endpoint. Also useful for testing if the webhook is accessible.
 */
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "Apple Health Webhook",
    version: "1.0.0",
    documentation: "https://openclaw.io/docs/health-sync",
    endpoints: {
      POST: {
        description: "Ingest health samples from iOS Shortcuts",
        authentication: "Bearer token (API key)",
        payload: {
          date: "YYYY-MM-DD (optional, defaults to today)",
          samples: [
            {
              type: "steps|heartRate|sleep|...",
              value: "number",
              unit: "count|bpm|hours|...",
              aggregation: "sum|average|min|max|latest|duration (optional)",
              startDate: "ISO date or Unix timestamp (optional)",
              endDate: "ISO date or Unix timestamp (optional)",
              source: "Device name (optional)",
            },
          ],
        },
      },
    },
  });
}
