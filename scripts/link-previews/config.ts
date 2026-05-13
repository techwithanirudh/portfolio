export const contentPatterns = [
  'content/blog/**/*.{md,mdx}',
  'content/work/**/*.{md,mdx}',
]

export const concurrency = 3

export const maxScreenshotAgeMs = 6 * 30 * 24 * 60 * 60 * 1000

export const linkPreviewConfig = {
  imageFormat: 'jpeg' as const,
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

export const mdxComponentAttributes: Record<string, string[]> = {
  Card: ['href'],
}

export const frontmatterUrlFields = ['website']
