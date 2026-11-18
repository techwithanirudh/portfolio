import { z } from 'zod'

export const contentGlobs = [
  'content/blog/**/*.{md,mdx}',
  'content/projects/**/*.{md,mdx}',
]

export const previewLinkSourceGlobs = ['src/constants/**/*.{ts,tsx}']

export const concurrency = 3

export const maxScreenshotAgeMs = 6 * 30 * 24 * 60 * 60 * 1000

const publicPath = '/previews'

export const screenshot = {
  image: {
    format: 'jpeg',
    quality: 92,
  } as const,
  paths: {
    manifest: `public${publicPath}/manifest.json`,
    output: `public${publicPath}`,
    publicPath,
  },
  retryTimeout: 45_000,
  timeout: 60_000,
  viewport: { height: 630, width: 1200 },
  waitAfterFallback: 3000,
  waitAfterLoad: 10_000,
}

export const exclusions = {
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
  hostnames: ['localhost', 'www.w3.org'],
}

export const frontmatterLinks = z.object({
  github: z.string().optional().catch(undefined),
  website: z.string().optional().catch(undefined),
})
