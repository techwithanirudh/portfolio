import type { MetadataRoute } from 'next'
import { baseUrl } from '@/lib/metadata'

export default function robots(): MetadataRoute.Robots {
  return {
    host: baseUrl.origin,
    rules: {
      allow: '/',
      disallow: ['/api/', '/account', '/login', '/search'],
      userAgent: '*',
    },
    sitemap: new URL('/sitemap.xml', baseUrl).href,
  }
}
