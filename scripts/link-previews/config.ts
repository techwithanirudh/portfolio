import type {
  DetectionConfig,
  ExclusionsConfig,
  ScreenshotConfig,
} from './types'

export const content = [
  'content/blog/**/*.{md,mdx}',
  'content/work/**/*.{md,mdx}',
]

export const concurrency = 3

export const maxScreenshotAgeMs = 6 * 30 * 24 * 60 * 60 * 1000

export const screenshot: ScreenshotConfig = {
  timeout: 60_000,
  waitAfterLoad: 10_000,
  viewport: { height: 630, width: 1200 },
  paths: {
    manifest: 'public/previews/manifest.json',
    output: 'public/previews',
  },
  image: {
    format: 'jpeg',
    quality: 92,
  },
}

export const exclusions: ExclusionsConfig = {
  domains: [
    'twitter.com',
    'x.com',
    'facebook.com',
    'instagram.com',
    'linkedin.com',
    'youtube.com',
    'youtu.be',
    'tiktok.com',
    'reddit.com',
    'discord.com',
    'slack.com',
  ],
  extensions: [
    '.zip',
    '.tar',
    '.gz',
    '.tgz',
    '.rar',
    '.7z',
    '.pdf',
    '.dmg',
    '.exe',
    '.pkg',
  ],
  hostnames: ['localhost'],
}

export const detection: DetectionConfig = {
  components: {
    // Card: ['href'],
  },
  frontmatter: ['website', 'github'],
}
