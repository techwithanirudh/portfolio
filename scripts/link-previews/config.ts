import type { LinkPreviewScriptConfig } from './types'

export const contentPatterns = [
  'content/blog/**/*.{md,mdx}',
  'content/work/**/*.{md,mdx}',
]

export const extractionVersion = 'remark-md-links-v1'

export const concurrency = 3

export const maxScreenshotAgeMs = 6 * 30 * 24 * 60 * 60 * 1000

export const linkPreviewConfig: LinkPreviewScriptConfig = {
  contentHashPath: 'public/previews/.content-hash',
  imageFormat: 'jpeg',
  imageQuality: 92,
  manifestPath: 'public/previews/manifest.json',
  outputDir: 'public/previews',
  screenshotHeight: 630,
  screenshotWidth: 1200,
  timeout: 30_000,
}

export const excludedDomains = [
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
]

export const excludedPathExtensions = [
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
]

export const internalHostnames = new Set([
  'techwithanirudh.com',
  'www.techwithanirudh.com',
  'localhost',
])

export const mdxComponentAttributes = {
  Card: ['href'],
} as Record<string, string[]>

export const frontmatterUrlFields = ['website']
