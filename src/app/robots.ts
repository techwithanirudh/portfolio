import type { MetadataRoute } from 'next'
import { baseUrl } from '@/lib/metadata'
import { url } from '@/lib/url'

export default function robots(): MetadataRoute.Robots {
  return {
    host: baseUrl.origin,
    rules: {
      allow: '/',
      // TODO(slopradar): magic-string: '/search' and '/account' are typed by hand while sitemap.ts reads pages.<key>.path, use pages.search.path (and pages.account once the account/page.tsx annotation adds it)
      disallow: ['/api/', '/account', '/login', '/search'],
      userAgent: '*',
    },
    sitemap: url('/sitemap.xml'),
  }
}
