import type { MetadataRoute } from 'next';

const BASE_URL = 'https://brightonhub.ai';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
    { path: '/', changeFrequency: 'hourly', priority: 1.0 },
    { path: '/environment', changeFrequency: 'hourly', priority: 0.9 },
    { path: '/environment/air-quality', changeFrequency: 'hourly', priority: 0.8 },
    { path: '/environment/carbon', changeFrequency: 'hourly', priority: 0.8 },
    { path: '/environment/flood', changeFrequency: 'hourly', priority: 0.8 },
    { path: '/weather', changeFrequency: 'hourly', priority: 0.9 },
    { path: '/crime', changeFrequency: 'daily', priority: 0.9 },
    { path: '/crime/categories', changeFrequency: 'daily', priority: 0.7 },
    { path: '/crime/neighbourhood', changeFrequency: 'daily', priority: 0.7 },
    { path: '/transport', changeFrequency: 'hourly', priority: 0.9 },
    { path: '/transport/trains', changeFrequency: 'hourly', priority: 0.8 },
    { path: '/transport/buses', changeFrequency: 'weekly', priority: 0.5 },
    { path: '/planning', changeFrequency: 'daily', priority: 0.8 },
    { path: '/planning/applications', changeFrequency: 'daily', priority: 0.7 },
    { path: '/health', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/housing', changeFrequency: 'daily', priority: 0.7 },
    { path: '/schools', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/community', changeFrequency: 'daily', priority: 0.7 },
    { path: '/entertainment', changeFrequency: 'daily', priority: 0.7 },
    { path: '/students', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.5 },
  ];

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
