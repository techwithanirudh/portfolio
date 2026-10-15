import type {
  DetectionConfig,
  ExclusionsConfig,
  ScreenshotConfig,
} from './types'

export const content = [
  'content/blog/**/*.{md,mdx}',
  'content/work/**/*.{md,mdx}',
]

// Non-MDX files whose links render through PreviewLink.
export const sources = [
  'src/constants/navigation/social.tsx',
  'src/constants/portfolio/colophon.ts',
  'src/constants/portfolio/experiences.tsx',
  'src/constants/portfolio/skills.tsx',
  'src/constants/portfolio/uses.ts',
  'src/app/(home)/colophon/_components/attribution.tsx',
  'src/app/(home)/uses/_components/coding.tsx',
  'src/components/layout/footer/links.tsx',
]

export const concurrency = 3

export const maxScreenshotAgeMs = 6 * 30 * 24 * 60 * 60 * 1000

export const screenshot: ScreenshotConfig = {
  image: {
    format: 'jpeg',
    quality: 92,
  },
  paths: {
    manifest: 'public/previews/manifest.json',
    output: 'public/previews',
  },
  timeout: 60_000,
  viewport: { height: 630, width: 1200 },
  waitAfterLoad: 10_000,
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
  hostnames: ['localhost', 'www.w3.org'],
}

export const detection: DetectionConfig = {
  components: {},
  frontmatter: ['website', 'github'],
}
