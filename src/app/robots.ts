import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: 'https://brightonhub.ai/sitemap.xml',
    host: 'https://brightonhub.ai',
  };
}
