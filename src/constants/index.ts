import { env } from '@/env'

// TODO(slopradar): two import paths: baseUrl is imported from @/constants (layout, rss) and @/lib/metadata (robots, sitemap, url.ts), pick one owner and delete this re-export
export { baseUrl } from '@/lib/metadata'
export const isProduction = env.NODE_ENV === 'production'
