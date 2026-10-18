import type { MetadataRoute } from 'next'
import { baseUrl } from '@/lib/metadata'
import { url } from '@/lib/url'

export default function robots(): MetadataRoute.Robots {
  return {
    host: baseUrl.origin,
    rules: {
      allow: '/',
      disallow: ['/api/', '/account', '/login', '/search'],
      userAgent: '*',
    },
    sitemap: url('/sitemap.xml'),
  }
}
