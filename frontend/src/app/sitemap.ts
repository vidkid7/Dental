import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://premierdentalcollege.edu';
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/services',
    '/doctors',
    '/academics',
    '/academics/bds',
    '/academics/mds',
    '/academics/internships',
    '/academics/admissions',
    '/patients',
    '/research',
    '/blog',
    '/contact',
    '/appointments/book',
  ];

  const staticRoutes = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // TODO: Add dynamic routes for blog posts, doctors, services, etc.
  // These would come from your API/database
  
  return staticRoutes;
}
