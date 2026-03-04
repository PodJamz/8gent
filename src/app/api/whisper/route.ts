import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/security';
import { auth } from '@/lib/openclaw/auth-server';
import { ConvexHttpClient } from '@/lib/convex-shim';
import { api } from '@/lib/convex-shim';

// ============================================================================
// Whisper Transcription API Route
// Accepts audio file and returns transcription
// Routes to local Whisper via Lynkr tunnel or falls back to OpenAI Whisper
// ============================================================================

export const runtime = 'nodejs'; // Required for FormData/File handling

// Rate limit: 5 transcriptions per minute per IP (more expensive operation)
const RATE_LIMIT_CONFIG = { windowMs: 60 * 1000, maxRequests: 5 };

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_WHISPER_URL = 'https://api.openai.com/v1/audio/transcriptions';

// Convex client for fetching AI settings (lazy initialized to avoid build-time errors)
let convexClient: ConvexHttpClient | null = null;
function getConvexClient(): ConvexHttpClient {
  if (!convexClient) {
    convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  }
  return convexClient;
}

// Owner ID for settings lookup (SECURITY: No fallback - fail securely)
const OWNER_USER_ID = process.env.OWNER_USER_ID;

interface AIProviderSettings {
  lynkrEnabled?: boolean;
  lynkrTunnelUrl?: string;
  lynkrApiKey?: string;
  whisperEnabled?: boolean;
}

// Supported audio formats by Whisper
const SUPPORTED_FORMATS = [
  'audio/webm',
  'audio/mp4',
  'audio/mpeg',
  'audio/mpga',
  'audio/m4a',
  'audio/wav',
  'audio/ogg',
  'audio/flac',
];

// Max file size: 25MB (Whisper limit)
const MAX_FILE_SIZE = 25 * 1024 * 1024;

/**
 * Get AI settings for routing (Lynkr tunnel vs cloud)
 */
async function getAIProviderSettings(): Promise<AIProviderSettings | null> {
  try {
    // SECURITY: Validate OWNER_USER_ID is configured
    if (!OWNER_USER_ID) {
      console.error('[Whisper] OWNER_USER_ID environment variable is required');
      return null;
    }

    const { userId } = await auth();

    // Only fetch settings for authenticated owner
    if (!userId) return null;

    // Check if user is owner via Convex
    const convex = getConvexClient();
    const user = await convex.query(api.userManagement.getManagedUserByClerkId, { clerkId: userId });
    if (user?.role !== 'owner') return null;

    const settings = await convex.query(api.aiSettings.getSettingsWithDefaults, {
      ownerId: OWNER_USER_ID,
    });

    return settings as AIProviderSettings;
  } catch (error) {
    console.error('[Whisper] Error fetching AI settings:', error);
    return null;
  }
}

/**
 * Route to local Whisper via Lynkr tunnel
 */
async function transcribeViaLynkr(
  formData: FormData,
  tunnelUrl: string,
  apiKey: string
): Promise<{ text: string; language?: string; provider: string } | null> {
  try {
    console.log(`[Whisper] Using Lynkr tunnel: ${tunnelUrl}`);

    const response = await fetch(`${tunnelUrl}/v1/audio/transcriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
      signal: AbortSignal.timeout(60000), // 60s timeout for audio
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Whisper] Lynkr error:', response.status, errorText);
      return null;
    }

    const result = await response.json();
    return {
      text: result.text || '',
      language: result.language,
      provider: 'local-whisper',
    };
  } catch (error) {
    console.error('[Whisper] Lynkr transcription failed:', error);
    return null;
  }
}

/**
 * Route to OpenAI Whisper cloud
 */
async function transcribeViaOpenAI(
  formData: FormData
): Promise<{ text: string; language?: string; provider: string } | { error: string; status: number }> {
  if (!OPENAI_API_KEY) {
    return { error: 'OpenAI API key not configured', status: 500 };
  }

  const response = await fetch(OPENAI_WHISPER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Whisper] OpenAI error:', response.status, errorText);

    if (response.status === 401) {
      return { error: 'Invalid API key', status: 401 };
    }

    if (response.status === 429) {
      return { error: 'Rate limit exceeded. Please try again later.', status: 429 };
    }

    return { error: 'Transcription failed. Please try again.', status: response.status };
  }

  const result = await response.json();
  return {
    text: result.text || '',
    language: result.language,
    provider: 'openai-whisper',
  };
}

export async function POST(request: NextRequest) {
  // SECURITY: Rate limiting to prevent API abuse
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`whisper:${clientIp}`, RATE_LIMIT_CONFIG);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded. Please wait before making more requests.',
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
    // Parse the incoming form data
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;
    const language = (formData.get('language') as string) || 'en';

    // Validate audio file presence
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Validate file size
    if (audioFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Audio file too large. Maximum size is 25MB.' },
        { status: 400 }
      );
    }

    // Validate file type (be lenient as browser mimeTypes can vary)
    const mimeType = audioFile.type.split(';')[0]; // Remove codec info
    const isValidFormat = SUPPORTED_FORMATS.some(
      (format) => mimeType.startsWith(format.split('/')[0]) || mimeType === format
    );

    if (!isValidFormat && audioFile.type) {
      console.warn(`[Whisper] Unusual audio format: ${audioFile.type}, attempting anyway`);
    }

    // Prepare the FormData for whisper API
    const whisperFormData = new FormData();

    // Convert File to proper format
    const ext = getExtensionFromMimeType(audioFile.type);
    const fileName = `audio.${ext}`;

    // Create a new File with proper name/extension
    const audioBlob = new Blob([await audioFile.arrayBuffer()], { type: audioFile.type });
    const namedFile = new File([audioBlob], fileName, { type: audioFile.type });

    whisperFormData.append('file', namedFile);
    whisperFormData.append('model', 'whisper-1');
    whisperFormData.append('language', language);
    whisperFormData.append('response_format', 'json');

    // Check if we should route to Lynkr (local Whisper)
    const settings = await getAIProviderSettings();

    if (settings?.lynkrEnabled && settings?.lynkrTunnelUrl && settings?.lynkrApiKey) {
      console.log('[Whisper] Attempting local transcription via Lynkr tunnel');

      // Try Lynkr first
      const lynkrResult = await transcribeViaLynkr(
        whisperFormData,
        settings.lynkrTunnelUrl,
        settings.lynkrApiKey
      );

      if (lynkrResult) {
        return NextResponse.json(lynkrResult);
      }

      // Fall back to OpenAI if Lynkr fails
      console.log('[Whisper] Lynkr failed, falling back to OpenAI');
    }

    // Use OpenAI Whisper (either as primary or fallback)
    const openaiResult = await transcribeViaOpenAI(whisperFormData);

    if ('error' in openaiResult) {
      return NextResponse.json(
        { error: openaiResult.error },
        { status: openaiResult.status }
      );
    }

    // Return the transcription
    return NextResponse.json({
      text: openaiResult.text,
      language: openaiResult.language || language,
      provider: openaiResult.provider,
    });
  } catch (error) {
    console.error('[Whisper] Error:', error);

    return NextResponse.json(
      { error: 'Failed to process audio. Please try again.' },
      { status: 500 }
    );
  }
}

// Helper to get file extension from mime type
function getExtensionFromMimeType(mimeType: string): string {
  const type = mimeType.split(';')[0]; // Remove codec info

  const mimeToExt: Record<string, string> = {
    'audio/webm': 'webm',
    'audio/mp4': 'm4a',
    'audio/mpeg': 'mp3',
    'audio/mpga': 'mp3',
    'audio/m4a': 'm4a',
    'audio/wav': 'wav',
    'audio/wave': 'wav',
    'audio/x-wav': 'wav',
    'audio/ogg': 'ogg',
    'audio/flac': 'flac',
  };

  return mimeToExt[type] || 'webm';
}
