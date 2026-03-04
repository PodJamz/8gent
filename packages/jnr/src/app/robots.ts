import { MetadataRoute } from 'next';

/**
 * Dynamic robots.txt generation for 8gent Jr
 * Includes AI search crawlers for Generative Engine Optimization (GEO)
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.8gent.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/tenant/',
          '/_next/',
          '/private/',
        ],
      },
      // Google Search
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/tenant/', '/private/'],
      },
      // Bing Search
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/tenant/', '/private/'],
      },
      // AI Search Crawlers - Generative Engine Optimization (GEO)
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/tenant/', '/private/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/api/', '/tenant/', '/private/'],
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
        disallow: ['/api/', '/tenant/', '/private/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/', '/tenant/', '/private/'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: ['/api/', '/tenant/', '/private/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/', '/tenant/', '/private/'],
      },
      {
        userAgent: 'Bytespider',
        allow: '/',
        disallow: ['/api/', '/tenant/', '/private/'],
      },
      {
        userAgent: 'cohere-ai',
        allow: '/',
        disallow: ['/api/', '/tenant/', '/private/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
