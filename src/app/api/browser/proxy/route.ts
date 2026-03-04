import { NextRequest, NextResponse } from "next/server";

/**
 * Browser Proxy API
 *
 * Proxies web pages for the embedded browser by:
 * 1. Fetching the target URL
 * 2. Stripping X-Frame-Options and CSP headers that block iframe embedding
 * 3. Rewriting relative URLs to absolute URLs
 * 4. Injecting a base tag for proper resource resolution
 */

const BLOCKED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  'internal',
  'intranet',
];

const TIMEOUT_MS = 10000;

function renderErrorPage(title: string, message: string, url?: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #fff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .container {
      text-align: center;
      max-width: 400px;
    }
    .icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      background: rgba(239, 68, 68, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon svg {
      width: 40px;
      height: 40px;
      color: #ef4444;
    }
    h1 {
      font-size: 1.5rem;
      margin-bottom: 0.75rem;
      font-weight: 600;
    }
    p {
      color: rgba(255,255,255,0.7);
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    .url {
      background: rgba(255,255,255,0.1);
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      word-break: break-all;
      margin-bottom: 1.5rem;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: #3b82f6;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.2s;
    }
    .btn:hover { background: #2563eb; }
    .btn svg { width: 16px; height: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <h1>${title}</h1>
    <p>${message}</p>
    ${url ? `<div class="url">${url}</div>` : ''}
    ${url ? `<a href="${url}" target="_blank" class="btn">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
      Open in Browser
    </a>` : ''}
  </div>
</body>
</html>`;
}

function isBlockedDomain(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return BLOCKED_DOMAINS.some(blocked =>
      urlObj.hostname.includes(blocked) ||
      urlObj.hostname.startsWith('192.168.') ||
      urlObj.hostname.startsWith('10.') ||
      urlObj.hostname.startsWith('172.')
    );
  } catch {
    return true;
  }
}

function rewriteHtml(html: string, baseUrl: string): string {
  const urlObj = new URL(baseUrl);
  const origin = urlObj.origin;

  // Check if there's already a base tag
  const hasBaseTag = /<base\s/i.test(html);

  // Inject base tag if not present (right after <head>)
  if (!hasBaseTag) {
    html = html.replace(
      /<head([^>]*)>/i,
      `<head$1><base href="${origin}/" target="_self">`
    );
  }

  // Rewrite protocol-relative URLs
  html = html.replace(/href="\/\//g, `href="https://`);
  html = html.replace(/src="\/\//g, `src="https://`);

  // Rewrite root-relative URLs for common attributes
  const rootRelativeRegex = /(href|src|action|poster|data)="(\/[^/][^"]*)"/gi;
  html = html.replace(rootRelativeRegex, (match, attr, path) => {
    return `${attr}="${origin}${path}"`;
  });

  // Rewrite srcset URLs
  html = html.replace(/srcset="([^"]+)"/gi, (match, srcset) => {
    const rewritten = srcset.split(',').map((part: string) => {
      const trimmed = part.trim();
      const [url, descriptor] = trimmed.split(/\s+/);
      if (url.startsWith('/') && !url.startsWith('//')) {
        return `${origin}${url}${descriptor ? ' ' + descriptor : ''}`;
      }
      return trimmed;
    }).join(', ');
    return `srcset="${rewritten}"`;
  });

  // Remove any CSP meta tags that might block content
  html = html.replace(/<meta[^>]*http-equiv=["']content-security-policy["'][^>]*>/gi, '');

  // Inject a script to handle link clicks (prevent navigating away from proxy)
  const clickHandler = `
    <script>
      document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.href && !link.href.startsWith('javascript:')) {
          e.preventDefault();
          window.parent.postMessage({ type: 'navigate', url: link.href }, '*');
        }
      }, true);
    </script>
  `;

  // Insert before </body> or at end
  if (html.includes('</body>')) {
    html = html.replace('</body>', `${clickHandler}</body>`);
  } else {
    html += clickHandler;
  }

  return html;
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return new NextResponse(
      renderErrorPage('No URL Provided', 'Please enter a URL to browse.'),
      { status: 400, headers: { 'Content-Type': 'text/html' } }
    );
  }

  // Validate URL
  let targetUrl: URL;
  try {
    targetUrl = new URL(url);
    if (!['http:', 'https:'].includes(targetUrl.protocol)) {
      throw new Error('Invalid protocol');
    }
  } catch {
    return new NextResponse(
      renderErrorPage('Invalid URL', 'The URL you entered is not valid. Make sure it starts with http:// or https://', url),
      { status: 400, headers: { 'Content-Type': 'text/html' } }
    );
  }

  // Block internal/private IPs
  if (isBlockedDomain(url)) {
    return new NextResponse(
      renderErrorPage('Access Denied', 'Access to internal or private network addresses is not allowed for security reasons.', url),
      { status: 403, headers: { 'Content-Type': 'text/html' } }
    );
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return new NextResponse(
        renderErrorPage(
          `Error ${response.status}`,
          `The server returned an error: ${response.statusText}. The page may not exist or may be temporarily unavailable.`,
          url
        ),
        { status: response.status, headers: { 'Content-Type': 'text/html' } }
      );
    }

    const contentType = response.headers.get('content-type') || '';

    // Handle HTML content
    if (contentType.includes('text/html')) {
      let html = await response.text();
      html = rewriteHtml(html, response.url || url);

      return new NextResponse(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          // Explicitly allow framing from our origin
          'X-Frame-Options': 'SAMEORIGIN',
          // Allow resources but be strict about scripts
          'Content-Security-Policy': "frame-ancestors 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; style-src 'self' 'unsafe-inline' *; img-src * data: blob:; font-src * data:; connect-src *;",
          'Cache-Control': 'no-store',
        },
      });
    }

    // Handle images - pass through
    if (contentType.startsWith('image/')) {
      const buffer = await response.arrayBuffer();
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // Handle CSS - pass through with URL rewriting
    if (contentType.includes('text/css')) {
      let css = await response.text();
      const origin = targetUrl.origin;

      // Rewrite url() references
      css = css.replace(/url\(\s*['"]?(\/[^'")]+)['"]?\s*\)/gi, (match, path) => {
        return `url(${origin}${path})`;
      });

      return new NextResponse(css, {
        status: 200,
        headers: {
          'Content-Type': 'text/css',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // Handle JavaScript - pass through
    if (contentType.includes('javascript')) {
      const js = await response.text();
      return new NextResponse(js, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // For other content types, pass through as-is
    const buffer = await response.arrayBuffer();
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
      },
    });

  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return new NextResponse(
          renderErrorPage(
            'Request Timed Out',
            'The page took too long to respond. Please try again or check if the site is available.',
            url
          ),
          { status: 504, headers: { 'Content-Type': 'text/html' } }
        );
      }
      return new NextResponse(
        renderErrorPage(
          'Connection Failed',
          `Unable to connect to the server: ${error.message}`,
          url
        ),
        { status: 500, headers: { 'Content-Type': 'text/html' } }
      );
    }
    return new NextResponse(
      renderErrorPage(
        'Something Went Wrong',
        'An unexpected error occurred while loading this page.',
        url
      ),
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    );
  }
}
