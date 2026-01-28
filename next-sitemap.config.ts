import type { IConfig } from 'next-sitemap'
import { env } from './src/env.ts'

const config: IConfig = {
  siteUrl: env.NEXT_PUBLIC_BASE_URL || 'https://example.com',
  generateRobotsTxt: true,
}

export default config