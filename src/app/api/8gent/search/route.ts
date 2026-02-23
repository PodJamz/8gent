import { NextRequest, NextResponse } from 'next/server';
import { searchSystem, SearchOptions } from '@/lib/8gent/search';
import { checkRateLimit, getClientIp } from '@/lib/security';

// Rate limit: 30 searches per minute per IP
const RATE_LIMIT_CONFIG = { windowMs: 60 * 1000, maxRequests: 30 };

export async function POST(request: NextRequest) {
  try {
    // SECURITY: Rate limiting to prevent abuse
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`search:${clientIp}`, RATE_LIMIT_CONFIG);

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

    const { query, category, limit } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const options: SearchOptions = {
      category: category || 'all',
      limit: limit || 10,
    };

    const results = searchSystem(query, options);

    return NextResponse.json({
      success: true,
      query,
      resultCount: results.length,
      results: results.map((r) => ({
        id: r.id,
        type: r.type,
        title: r.title,
        description: r.description,
        url: r.url,
        relevance: r.relevance,
        metadata: r.metadata,
      })),
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // SECURITY: Rate limiting to prevent abuse
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`search:${clientIp}`, RATE_LIMIT_CONFIG);

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

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const category = searchParams.get('category');
  const limit = searchParams.get('limit');

  if (!query) {
    return NextResponse.json(
      { error: 'Search query (q) is required' },
      { status: 400 }
    );
  }

  const options: SearchOptions = {
    category: (category as SearchOptions['category']) || 'all',
    limit: limit ? parseInt(limit, 10) : 10,
  };

  const results = searchSystem(query, options);

  return NextResponse.json({
    success: true,
    query,
    resultCount: results.length,
    results: results.map((r) => ({
      id: r.id,
      type: r.type,
      title: r.title,
      description: r.description,
      url: r.url,
      relevance: r.relevance,
      metadata: r.metadata,
    })),
  });
}
