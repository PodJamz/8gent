import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/security';
import { auth } from '@/lib/openclaw/auth-server';
import { ConvexHttpClient } from '@/lib/convex-shim';
import { api } from '@/lib/convex-shim';

// ============================================================================
// Music Generation API Route
// Accepts prompt/lyrics and returns generated audio
// Routes to local ACE-Step via Lynkr tunnel
// ============================================================================

export const runtime = 'nodejs';

// Rate limit: 10 generations per hour per IP (expensive operation)
const RATE_LIMIT_CONFIG = { windowMs: 60 * 60 * 1000, maxRequests: 10 };

// Convex client for fetching AI settings (lazy initialized)
let convexClient: ConvexHttpClient | null = null;
function getConvexClient(): ConvexHttpClient {
  if (!convexClient) {
    convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  }
  return convexClient;
}

// Owner ID for settings lookup (SECURITY: No fallback - fail securely)
const OWNER_USER_ID = process.env.OWNER_USER_ID;

// Direct ACE-Step URL for local development (bypasses Lynkr)
const ACESTEP_DIRECT_URL = process.env.ACESTEP_DIRECT_URL || 'http://localhost:8001';

interface AIProviderSettings {
  lynkrEnabled?: boolean;
  lynkrTunnelUrl?: string;
  lynkrApiKey?: string;
  acestepEnabled?: boolean;
}

export interface MusicGenerateRequest {
  prompt: string;
  lyrics?: string;
  duration?: number; // 10-600 seconds
  bpm?: number; // 60-200
  key?: string; // e.g., "C major", "A minor"
  timeSignature?: string; // e.g., "4/4", "3/4"
  referenceAudio?: string; // Base64 or URL
  referenceStrength?: number; // 0-1
  model?: string;
  lmModel?: string;
  format?: 'mp3' | 'wav';
  title?: string;
  saveToJamz?: boolean;
  projectId?: string;
}

export interface MusicGenerateResponse {
  id: string;
  status: 'completed' | 'processing' | 'failed';
  audioUrl?: string;
  audioBase64?: string;
  duration: number;
  metadata: {
    bpm: number;
    key: string;
    timeSignature: string;
    model: string;
    lmModel?: string;
  };
  provider: string;
  title?: string;
}

/**
 * Get AI settings for routing (Lynkr tunnel vs cloud)
 * Supports both Clerk auth (web) and internal auth (WhatsApp bridge)
 */
async function getAIProviderSettings(isInternalRequest: boolean = false): Promise<AIProviderSettings | null> {
  try {
    // SECURITY: Validate OWNER_USER_ID is configured
    if (!OWNER_USER_ID) {
      console.error('[MusicGen] OWNER_USER_ID environment variable is required');
      return null;
    }

    const convex = getConvexClient();

    // For internal requests (e.g., WhatsApp bridge), skip Clerk auth
    if (isInternalRequest) {
      console.log('[MusicGen] Internal request - fetching owner settings directly');
      const settings = await convex.query(api.aiSettings.getSettingsWithDefaults, {
        ownerId: OWNER_USER_ID,
      });
      return settings as AIProviderSettings;
    }

    // For web requests, verify via Clerk
    const { userId } = await auth();

    // Only fetch settings for authenticated owner
    if (!userId) return null;

    // Check if user is owner via Convex
    const user = await convex.query(api.userManagement.getManagedUserByClerkId, { clerkId: userId });
    if (user?.role !== 'owner') return null;

    const settings = await convex.query(api.aiSettings.getSettingsWithDefaults, {
      ownerId: OWNER_USER_ID,
    });

    return settings as AIProviderSettings;
  } catch (error) {
    console.error('[MusicGen] Error fetching AI settings:', error);
    return null;
  }
}

/**
 * Generate music directly via local ACE-Step API (dev mode)
 */
async function generateDirectAceStep(
  request: MusicGenerateRequest
): Promise<MusicGenerateResponse | null> {
  try {
    console.log(`[MusicGen] Direct ACE-Step call to: ${ACESTEP_DIRECT_URL}`);

    // ACE-Step Gradio API format
    const aceStepRequest = {
      prompt: request.prompt,
      lyrics: request.lyrics || '',
      duration: request.duration || 30,
      bpm: request.bpm || 120,
      key: request.key || 'C major',
      time_signature: request.timeSignature || '4/4',
      // ACE-Step specific params
      infer_step: 60,
      guidance_scale: 15,
      guidance_scale_text: 5.0,
      guidance_scale_lyric: 5.0,
      manual_seeds: -1,
      audio2audio_enable: false,
      ref_audio_strength: request.referenceStrength || 0.5,
    };

    // Try the Gradio API endpoint first (if using gradio server)
    const response = await fetch(`${ACESTEP_DIRECT_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fn_index: 0, // Main generate function
        data: [
          aceStepRequest.prompt,       // prompt
          aceStepRequest.lyrics,       // lyrics
          aceStepRequest.duration,     // duration
          aceStepRequest.infer_step,   // infer_step
          aceStepRequest.guidance_scale, // guidance_scale
          aceStepRequest.guidance_scale_text, // guidance_scale_text
          aceStepRequest.guidance_scale_lyric, // guidance_scale_lyric
          aceStepRequest.audio2audio_enable, // audio2audio_enable
          null,                        // ref_audio_input
          aceStepRequest.ref_audio_strength, // ref_audio_strength
          aceStepRequest.manual_seeds, // manual_seeds
        ],
      }),
      signal: AbortSignal.timeout(600000), // 10 min timeout for generation
    });

    if (!response.ok) {
      // Try REST API format as fallback
      console.log('[MusicGen] Gradio API failed, trying REST endpoint...');
      const restResponse = await fetch(`${ACESTEP_DIRECT_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aceStepRequest),
        signal: AbortSignal.timeout(600000),
      });

      if (!restResponse.ok) {
        const errorText = await restResponse.text();
        console.error('[MusicGen] ACE-Step error:', restResponse.status, errorText);
        return null;
      }

      const result = await restResponse.json();
      return formatAceStepResult(result, request);
    }

    const result = await response.json();

    // Gradio returns data array
    if (result.data) {
      const audioPath = result.data[0]; // Path to generated audio
      return {
        id: `gen_${Date.now()}`,
        status: 'completed',
        audioUrl: audioPath?.url || audioPath,
        audioBase64: audioPath?.data, // If base64 encoded
        duration: request.duration || 30,
        metadata: {
          bpm: request.bpm || 120,
          key: request.key || 'C major',
          timeSignature: request.timeSignature || '4/4',
          model: 'acestep-v15-turbo',
          lmModel: 'acestep-5Hz-lm-1.7B',
        },
        provider: 'local-acestep-direct',
        title: request.title,
      };
    }

    return formatAceStepResult(result, request);
  } catch (error) {
    console.error('[MusicGen] Direct ACE-Step generation failed:', error);
    return null;
  }
}

function formatAceStepResult(result: Record<string, unknown>, request: MusicGenerateRequest): MusicGenerateResponse {
  return {
    id: (result.id as string) || `gen_${Date.now()}`,
    status: 'completed',
    audioUrl: result.audio_url as string | undefined,
    audioBase64: result.audio_base64 as string | undefined,
    duration: (result.duration as number) || request.duration || 30,
    metadata: {
      bpm: ((result.metadata as Record<string, unknown>)?.bpm as number) || request.bpm || 120,
      key: ((result.metadata as Record<string, unknown>)?.key as string) || request.key || 'C major',
      timeSignature: ((result.metadata as Record<string, unknown>)?.time_signature as string) || request.timeSignature || '4/4',
      model: ((result.metadata as Record<string, unknown>)?.model as string) || 'acestep-v15-turbo',
      lmModel: ((result.metadata as Record<string, unknown>)?.lm_model as string) || 'acestep-5Hz-lm-1.7B',
    },
    provider: 'local-acestep-direct',
    title: request.title,
  };
}

/**
 * Generate music via Lynkr tunnel to local ACE-Step
 */
async function generateViaLynkr(
  request: MusicGenerateRequest,
  tunnelUrl: string,
  apiKey: string
): Promise<MusicGenerateResponse | null> {
  try {
    console.log(`[MusicGen] Using Lynkr tunnel: ${tunnelUrl}`);

    // Prepare ACE-Step request format
    const aceStepRequest = {
      prompt: request.prompt,
      lyrics: request.lyrics,
      duration: request.duration || 30,
      bpm: request.bpm,
      key: request.key,
      time_signature: request.timeSignature || '4/4',
      reference_audio: request.referenceAudio,
      reference_strength: request.referenceStrength || 0.5,
      model: request.model || 'acestep-v15-turbo',
      lm_model: request.lmModel || 'acestep-5Hz-lm-1.7B',
      format: request.format || 'mp3',
    };

    // Step 1: Create task (returns 202 with task_id)
    // Use X-Remote-Access-Key header for Lynkr auth (not Bearer token)
    const createResponse = await fetch(`${tunnelUrl}/v1/audio/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Remote-Access-Key': apiKey,
      },
      body: JSON.stringify(aceStepRequest),
      signal: AbortSignal.timeout(10000), // 10s timeout for task creation
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('[MusicGen] Lynkr task creation error:', createResponse.status, errorText);
      return null;
    }

    const createResult = await createResponse.json();
    const taskId = createResult.id || createResult.task_id;

    if (!taskId) {
      console.error('[MusicGen] No task_id in Lynkr response:', createResult);
      return null;
    }

    console.log(`[MusicGen] Task created: ${taskId}, polling for completion...`);

    // Step 2: Poll for completion (with timeout)
    const maxWaitTime = 300000; // 5 minutes max
    const pollInterval = 2000; // Poll every 2 seconds
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));

      const statusResponse = await fetch(`${tunnelUrl}/v1/audio/generate/${taskId}/status`, {
        method: 'GET',
        headers: {
          'X-Remote-Access-Key': apiKey,
        },
        signal: AbortSignal.timeout(5000),
      });

      if (!statusResponse.ok) {
        console.error('[MusicGen] Status poll error:', statusResponse.status);
        continue; // Retry on next poll
      }

      const statusResult = await statusResponse.json();

      if (statusResult.status === 'completed' && statusResult.audioUrl) {
        // Generation complete!
        return {
          id: statusResult.id || taskId,
          status: 'completed',
          audioUrl: statusResult.audioUrl || statusResult.audio_url,
          audioBase64: statusResult.audioBase64 || statusResult.audio_base64,
          duration: statusResult.duration || request.duration || 30,
          metadata: {
            bpm: statusResult.metadata?.bpm || request.bpm || 120,
            key: statusResult.metadata?.key || request.key || 'C major',
            timeSignature: statusResult.metadata?.time_signature || statusResult.metadata?.timeSignature || request.timeSignature || '4/4',
            model: statusResult.metadata?.model || aceStepRequest.model,
            lmModel: statusResult.metadata?.lm_model || statusResult.metadata?.lmModel || aceStepRequest.lm_model,
          },
          provider: 'local-acestep',
          title: request.title,
        };
      }

      if (statusResult.status === 'failed') {
        console.error('[MusicGen] Generation failed:', statusResult.error);
        return null;
      }

      // Still processing, continue polling
      console.log(`[MusicGen] Status: ${statusResult.status}, progress: ${(statusResult.progress || 0) * 100}%`);
    }

    // Timeout
    console.error('[MusicGen] Polling timeout after 5 minutes');
    return null;
  } catch (error) {
    console.error('[MusicGen] Lynkr generation failed:', error);
    return null;
  }
}

/**
 * Analyze audio via Lynkr tunnel to local ACE-Step
 */
async function analyzeViaLynkr(
  audioUrl: string,
  extract: string[],
  tunnelUrl: string,
  apiKey: string
): Promise<Record<string, unknown> | null> {
  try {
    const response = await fetch(`${tunnelUrl}/v1/audio/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Remote-Access-Key': apiKey,
      },
      body: JSON.stringify({
        audio: audioUrl,
        extract: extract || ['bpm', 'key', 'time_signature', 'caption'],
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[MusicGen] Analyze error:', response.status, errorText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('[MusicGen] Analyze failed:', error);
    return null;
  }
}

/**
 * Separate stems via Lynkr tunnel to local ACE-Step
 */
async function separateStemsViaLynkr(
  audioUrl: string,
  stems: string[],
  tunnelUrl: string,
  apiKey: string
): Promise<Record<string, string> | null> {
  try {
    const response = await fetch(`${tunnelUrl}/v1/audio/separate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Remote-Access-Key': apiKey,
      },
      body: JSON.stringify({
        audio: audioUrl,
        stems: stems || ['vocals', 'drums', 'bass', 'other'],
      }),
      signal: AbortSignal.timeout(180000), // 3 min for separation
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[MusicGen] Separate error:', response.status, errorText);
      return null;
    }

    const result = await response.json();
    return result.stems;
  } catch (error) {
    console.error('[MusicGen] Separation failed:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  // SECURITY: Rate limiting
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`music:${clientIp}`, RATE_LIMIT_CONFIG);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded. Maximum 10 generations per hour.',
        retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000))
        }
      }
    );
  }

  try {
    const body = await request.json() as MusicGenerateRequest & { action?: string };
    const { action = 'generate' } = body;

    // Validate required fields
    if (action === 'generate' && !body.prompt) {
      return NextResponse.json(
        { error: 'Prompt is required for music generation' },
        { status: 400 }
      );
    }

    // Validate duration
    if (body.duration && (body.duration < 10 || body.duration > 600)) {
      return NextResponse.json(
        { error: 'Duration must be between 10 and 600 seconds' },
        { status: 400 }
      );
    }

    // Check for internal request (from WhatsApp bridge or other internal services)
    // Internal requests can use x-internal-secret header or come from localhost
    const internalSecret = request.headers.get('x-internal-secret');
    const host = request.headers.get('host') || '';
    const clientIpForInternal = getClientIp(request);

    // Check multiple indicators for internal requests
    const isLocalhostHost = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
    const isLocalhostIp = clientIpForInternal === '127.0.0.1' || clientIpForInternal === '::1' || clientIpForInternal === 'localhost';
    const hasValidInternalSecret = internalSecret === process.env.INTERNAL_API_SECRET && !!process.env.INTERNAL_API_SECRET;

    // Allow internal requests from localhost or with valid secret
    const isInternalRequest = hasValidInternalSecret || isLocalhostHost || isLocalhostIp;
    const isDev = process.env.NODE_ENV === 'development' || process.env.ACESTEP_DIRECT_URL;

    console.log('[MusicGen] Request check:', {
      host,
      clientIp: clientIpForInternal,
      hasSecret: !!internalSecret,
      isLocalhostHost,
      isLocalhostIp,
      isInternalRequest,
      isDev,
    });

    if (isInternalRequest) {
      console.log('[MusicGen] Internal request detected - bypassing Clerk auth');
    }

    // Check if we should route to Lynkr (local ACE-Step) or direct
    const settings = await getAIProviderSettings(isInternalRequest);
    const useLynkr = settings?.lynkrEnabled && settings?.lynkrTunnelUrl && settings?.lynkrApiKey;

    // Validate API key length (must be 32+ chars for security)
    if (useLynkr && settings!.lynkrApiKey!.length < 32) {
      return NextResponse.json(
        { error: 'Lynkr API key must be at least 32 characters. Update in /settings/ai' },
        { status: 503 }
      );
    }

    // useLynkr already handles the check - Lynkr is enabled if settings exist

    // Route based on action
    switch (action) {
      case 'generate': {
        let result: MusicGenerateResponse | null = null;

        // Try Lynkr first if configured
        if (useLynkr) {
          result = await generateViaLynkr(
            body,
            settings!.lynkrTunnelUrl!,
            settings!.lynkrApiKey!
          );
        }

        // Fall back to direct ACE-Step in dev mode
        if (!result && isDev) {
          console.log('[MusicGen] Trying direct ACE-Step connection...');
          result = await generateDirectAceStep(body);
        }

        if (!result) {
          return NextResponse.json(
            {
              error: 'Music generation failed. Ensure ACE-Step is running locally on port 8001.',
              hint: useLynkr ? 'Lynkr tunnel configured but failed' : 'Set ACESTEP_DIRECT_URL or configure Lynkr in /settings/ai'
            },
            { status: 500 }
          );
        }

        return NextResponse.json(result);
      }

      case 'analyze': {
        if (!useLynkr) {
          return NextResponse.json(
            { error: 'Audio analysis requires Lynkr tunnel. Configure in /settings/ai' },
            { status: 503 }
          );
        }

        const audioUrl = (body as { audioUrl?: string }).audioUrl;
        const extract = (body as { extract?: string[] }).extract;

        if (!audioUrl) {
          return NextResponse.json(
            { error: 'audioUrl is required for analysis' },
            { status: 400 }
          );
        }

        const analysis = await analyzeViaLynkr(
          audioUrl,
          extract || ['bpm', 'key', 'time_signature', 'caption'],
          settings!.lynkrTunnelUrl!,
          settings!.lynkrApiKey!
        );

        if (!analysis) {
          return NextResponse.json(
            { error: 'Audio analysis failed.' },
            { status: 500 }
          );
        }

        return NextResponse.json({ ...analysis, provider: 'local-acestep' });
      }

      case 'separate': {
        if (!useLynkr) {
          return NextResponse.json(
            { error: 'Stem separation requires Lynkr tunnel. Configure in /settings/ai' },
            { status: 503 }
          );
        }

        const audioUrl = (body as { audioUrl?: string }).audioUrl;
        const stems = (body as { stems?: string[] }).stems;

        if (!audioUrl) {
          return NextResponse.json(
            { error: 'audioUrl is required for stem separation' },
            { status: 400 }
          );
        }

        const separated = await separateStemsViaLynkr(
          audioUrl,
          stems || ['vocals', 'drums', 'bass', 'other'],
          settings!.lynkrTunnelUrl!,
          settings!.lynkrApiKey!
        );

        if (!separated) {
          return NextResponse.json(
            { error: 'Stem separation failed.' },
            { status: 500 }
          );
        }

        return NextResponse.json({ stems: separated, provider: 'local-acestep' });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[MusicGen] Error:', error);

    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  const settings = await getAIProviderSettings();
  const useLynkr = settings?.lynkrEnabled && settings?.lynkrTunnelUrl;
  const isDev = process.env.NODE_ENV === 'development' || process.env.ACESTEP_DIRECT_URL;

  // Try Lynkr first
  if (useLynkr) {
    try {
      const response = await fetch(`${settings.lynkrTunnelUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const health = await response.json();
        return NextResponse.json({
          available: true,
          acestepEnabled: health.acestep?.enabled ?? false,
          models: health.acestep?.models ?? [],
          provider: 'local-acestep-lynkr',
        });
      }
    } catch {
      console.log('[MusicGen] Lynkr health check failed, trying direct...');
    }
  }

  // Try direct ACE-Step in dev mode
  if (isDev) {
    try {
      // ACE-Step Gradio health check
      const response = await fetch(`${ACESTEP_DIRECT_URL}/info`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        return NextResponse.json({
          available: true,
          acestepEnabled: true,
          models: ['acestep-v15-turbo'],
          provider: 'local-acestep-direct',
          url: ACESTEP_DIRECT_URL,
        });
      }

      // Try root endpoint as fallback
      const rootResponse = await fetch(ACESTEP_DIRECT_URL, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });

      if (rootResponse.ok) {
        return NextResponse.json({
          available: true,
          acestepEnabled: true,
          models: ['acestep-v15-turbo'],
          provider: 'local-acestep-direct',
          url: ACESTEP_DIRECT_URL,
        });
      }
    } catch (error) {
      console.log('[MusicGen] Direct ACE-Step health check failed:', error);
    }
  }

  return NextResponse.json({
    available: false,
    reason: useLynkr ? 'ACE-Step not responding' : 'Configure Lynkr tunnel or set ACESTEP_DIRECT_URL',
    hint: isDev ? `Ensure ACE-Step is running at ${ACESTEP_DIRECT_URL}` : undefined,
  });
}
