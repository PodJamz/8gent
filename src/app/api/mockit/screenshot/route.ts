import { NextRequest, NextResponse } from 'next/server';

// Device viewport configurations
const VIEWPORTS = {
  mobile: { width: 393, height: 852 },
  tablet: { width: 834, height: 1194 },
  desktop: { width: 1512, height: 982 },
};

type DeviceType = 'mobile' | 'tablet' | 'desktop';

// Timeout for individual API calls (8 seconds to stay under Vercel's limit)
const API_TIMEOUT = 8000;

// Helper to create fetch with timeout
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = API_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Capture using ScreenshotOne API
async function captureWithScreenshotOne(
  url: string,
  device: DeviceType
): Promise<{ dataUrl: string | null; error?: string }> {
  const viewport = VIEWPORTS[device];
  const apiKey = process.env.SCREENSHOTONE_API_KEY;

  if (!apiKey) {
    return { dataUrl: null, error: 'SCREENSHOTONE_API_KEY not configured' };
  }

  try {
    const params = new URLSearchParams({
      url,
      viewport_width: viewport.width.toString(),
      viewport_height: viewport.height.toString(),
      format: 'png',
      full_page: 'false',
      device_scale_factor: '2',
      delay: '1', // Reduce delay to speed up
      timeout: '5', // 5 second timeout on their end
    });

    const apiUrl = `https://api.screenshotone.com/take?access_key=${apiKey}&${params.toString()}`;
    console.log(`[ScreenshotOne] Fetching screenshot for ${device}...`);

    const response = await fetchWithTimeout(apiUrl, { cache: 'no-store' });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API returned ${response.status}: ${text.slice(0, 100)}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('image/')) {
      const text = await response.text();
      throw new Error(`Non-image response: ${text.slice(0, 100)}`);
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    console.log(`[ScreenshotOne] Success for ${device}`);
    return { dataUrl: `data:image/png;base64,${base64}` };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const isTimeout = errorMsg.includes('aborted');
    console.error(`[ScreenshotOne] ${device}: ${isTimeout ? 'Timeout' : errorMsg}`);
    return { dataUrl: null, error: `ScreenshotOne: ${isTimeout ? 'Timeout' : errorMsg}` };
  }
}

// Capture using Microlink API (free, no key required)
async function captureWithMicrolink(
  url: string,
  device: DeviceType
): Promise<{ dataUrl: string | null; error?: string }> {
  const viewport = VIEWPORTS[device];

  try {
    const params = new URLSearchParams({
      url,
      screenshot: 'true',
      'viewport.width': viewport.width.toString(),
      'viewport.height': viewport.height.toString(),
      'viewport.deviceScaleFactor': '2',
      waitUntil: 'domcontentloaded', // Faster than networkidle
    });

    const apiUrl = `https://api.microlink.io?${params.toString()}`;
    console.log(`[Microlink] Fetching for ${device}...`);

    const response = await fetchWithTimeout(
      apiUrl,
      {
        headers: process.env.MICROLINK_API_KEY
          ? { 'x-api-key': process.env.MICROLINK_API_KEY }
          : {},
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API returned ${response.status}: ${text.slice(0, 100)}`);
    }

    const data = await response.json();

    if (data.status === 'success' && data.data?.screenshot?.url) {
      // Fetch the screenshot image with timeout
      const imageResponse = await fetchWithTimeout(data.data.screenshot.url, {}, 5000);
      if (!imageResponse.ok) {
        throw new Error(`Image fetch failed: ${imageResponse.status}`);
      }
      const buffer = await imageResponse.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      return { dataUrl: `data:image/png;base64,${base64}` };
    }

    throw new Error(`Invalid response: ${data.status}`);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const isTimeout = errorMsg.includes('aborted');
    console.error(`[Microlink] ${device}: ${isTimeout ? 'Timeout' : errorMsg}`);
    return { dataUrl: null, error: `Microlink: ${isTimeout ? 'Timeout' : errorMsg}` };
  }
}

// Try screenshot APIs with fallback
async function captureScreenshot(
  url: string,
  device: DeviceType
): Promise<{ dataUrl: string | null; method: string; errors: string[] }> {
  const errors: string[] = [];

  // Try ScreenshotOne first (if configured)
  if (process.env.SCREENSHOTONE_API_KEY) {
    const result = await captureWithScreenshotOne(url, device);
    if (result.dataUrl) {
      return { dataUrl: result.dataUrl, method: 'screenshotone', errors: [] };
    }
    if (result.error) errors.push(result.error);
  }

  // Try Microlink as fallback
  const microlinkResult = await captureWithMicrolink(url, device);
  if (microlinkResult.dataUrl) {
    return { dataUrl: microlinkResult.dataUrl, method: 'microlink', errors };
  }
  if (microlinkResult.error) errors.push(microlinkResult.error);

  return { dataUrl: null, method: 'placeholder', errors };
}

// Generate a placeholder SVG
function generatePlaceholder(url: string, device: DeviceType): string {
  const viewport = VIEWPORTS[device];
  let hostname: string;
  try {
    hostname = new URL(url).hostname;
  } catch {
    hostname = url;
  }

  const svg = `
    <svg width="${viewport.width}" height="${viewport.height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <rect x="20" y="20" width="${viewport.width - 40}" height="60" rx="8" fill="#0f3460"/>
      <circle cx="50" cy="50" r="10" fill="#e94560"/>
      <circle cx="80" cy="50" r="10" fill="#f5a623"/>
      <circle cx="110" cy="50" r="10" fill="#7ed321"/>
      <text x="${viewport.width / 2}" y="55" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" text-anchor="middle">${hostname}</text>
      <rect x="20" y="100" width="${viewport.width - 40}" height="${viewport.height - 120}" rx="8" fill="#0f3460" opacity="0.5"/>
      <text x="${viewport.width / 2}" y="${viewport.height / 2}" fill="#ffffff80" font-family="system-ui, sans-serif" font-size="24" text-anchor="middle">Preview</text>
      <text x="${viewport.width / 2}" y="${viewport.height / 2 + 40}" fill="#ffffff40" font-family="system-ui, sans-serif" font-size="14" text-anchor="middle">${device} • ${viewport.width}×${viewport.height}</text>
    </svg>
  `.trim();

  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { url, devices = ['mobile', 'tablet', 'desktop'] } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL
    let validUrl: string;
    try {
      validUrl = new URL(url).toString();
    } catch {
      try {
        validUrl = new URL(`https://${url}`).toString();
      } catch {
        return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
      }
    }

    const useDemoMode = process.env.MOCKIT_DEMO_MODE === 'true';
    const allErrors: string[] = [];

    console.log(`[Screenshot API] Starting capture for ${validUrl}`);
    console.log(`[Screenshot API] Config: demoMode=${useDemoMode}, screenshotOneKey=${!!process.env.SCREENSHOTONE_API_KEY}`);

    // Capture all screenshots in PARALLEL to speed up
    const capturePromises = (devices as DeviceType[]).map(async (device) => {
      const viewport = VIEWPORTS[device];
      if (!viewport) return null;

      let dataUrl: string | null = null;
      let method = 'placeholder';
      let errors: string[] = [];

      if (useDemoMode) {
        dataUrl = generatePlaceholder(validUrl, device);
        method = 'demo';
      } else {
        const result = await captureScreenshot(validUrl, device);
        dataUrl = result.dataUrl;
        method = result.method;
        errors = result.errors;
      }

      // Fallback to placeholder if capture failed
      if (!dataUrl) {
        dataUrl = generatePlaceholder(validUrl, device);
        method = 'placeholder';
      }

      return {
        device,
        dataUrl,
        width: viewport.width,
        height: viewport.height,
        method,
        errors: errors.length > 0 ? errors : undefined,
      };
    });

    const results = await Promise.all(capturePromises);
    const screenshots = results.filter((r): r is NonNullable<typeof r> => r !== null);

    // Collect all errors
    screenshots.forEach((s) => {
      if (s.errors) {
        allErrors.push(...s.errors.map((e) => `[${s.device}] ${e}`));
      }
    });

    const primaryMethod = screenshots[0]?.method || 'unknown';
    const elapsed = Date.now() - startTime;
    console.log(`[Screenshot API] Completed in ${elapsed}ms with method: ${primaryMethod}`);

    return NextResponse.json({
      success: true,
      url: validUrl,
      screenshots,
      capturedAt: Date.now(),
      mode: primaryMethod,
      debug: {
        demoMode: useDemoMode,
        screenshotOneConfigured: !!process.env.SCREENSHOTONE_API_KEY,
        elapsed,
        errors: allErrors.length > 0 ? allErrors : undefined,
      },
    });
  } catch (error) {
    console.error('Screenshot capture error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to capture screenshots',
        debug: {
          errorType: error instanceof Error ? error.constructor.name : typeof error,
          screenshotOneConfigured: !!process.env.SCREENSHOTONE_API_KEY,
          elapsed: Date.now() - startTime,
        },
      },
      { status: 500 }
    );
  }
}
