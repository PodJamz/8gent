// Humans App Search API Route
// Proxies requests to Exa API to avoid CORS issues

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, numResults = 10 } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const apiKey = process.env.EXA_API_KEY;

    // If no API key, return empty results (client will use mock data)
    if (!apiKey) {
      console.warn('[Humans Search] EXA_API_KEY not configured');
      return NextResponse.json({
        results: [],
        useMock: true,
        message: 'Exa API key not configured, using mock data'
      });
    }

    // Exa API request - using /search endpoint with contents
    const requestBody = {
      query,
      category: 'people',
      useAutoprompt: true,
      numResults,
      contents: {
        text: true,
      },
    };

    console.log('[Humans Search] Calling Exa API with query:', query);

    const response = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Humans Search] Exa API error:', response.status, errorText);
      return NextResponse.json({
        results: [],
        useMock: true,
        message: `Exa API error (${response.status}), using mock data`
      });
    }

    const data = await response.json();

    console.log('[Humans Search] Exa returned', data.results?.length || 0, 'results');

    // Handle empty results
    if (!data.results || data.results.length === 0) {
      return NextResponse.json({
        results: [],
        useMock: true,
        message: 'No results from Exa, using mock data'
      });
    }

    return NextResponse.json({
      results: data.results.map((result: Record<string, unknown>) => ({
        id: result.id as string,
        url: result.url as string,
        title: result.title as string,
        snippet: (result.text as string) || (result.highlights as string[] || []).join(' '),
        publishedDate: result.publishedDate as string | undefined,
        author: result.author as string | undefined,
        image: result.image as string | undefined,
      })),
      useMock: false,
    });
  } catch (error) {
    console.error('[Humans Search] API error:', error);
    return NextResponse.json({
      results: [],
      useMock: true,
      message: 'Search failed, using mock data'
    });
  }
}
