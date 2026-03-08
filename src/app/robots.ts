import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/login', '/register'],
      disallow: ['/holdings/', '/ledger/', '/api/'],
    },
    sitemap: 'https://portfolio-tracker.example.com/sitemap.xml',
  };
}
