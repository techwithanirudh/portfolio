import type { IConfig } from 'next-sitemap'
import { env } from './src/env.ts'

const config: IConfig = {
  siteUrl: env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  generateRobotsTxt: true,
}

export default config