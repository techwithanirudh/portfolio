import type { MetadataRoute } from 'next'
import { pages } from '@/constants/pages'
import { baseUrl } from '@/lib/metadata'
import { url } from '@/lib/url'

export default function robots(): MetadataRoute.Robots {
  return {
    host: baseUrl.origin,
    rules: {
      allow: '/',
      disallow: ['/api/', pages.account.path, '/login', pages.search.path],
      userAgent: '*',
    },
    sitemap: url('/sitemap.xml'),
  }
}
