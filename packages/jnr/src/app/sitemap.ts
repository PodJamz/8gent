import { MetadataRoute } from 'next';

/**
 * Dynamic sitemap generation for 8gent Jr
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.8gent.app';
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/demo`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/onboarding`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Future pages can be added here
    // {
    //   url: `${baseUrl}/pricing`,
    //   lastModified,
    //   changeFrequency: 'monthly',
    //   priority: 0.7,
    // },
    // {
    //   url: `${baseUrl}/about`,
    //   lastModified,
    //   changeFrequency: 'monthly',
    //   priority: 0.6,
    // },
  ];
}
