import fs from 'node:fs/promises'
import path from 'node:path'
import type { Browser } from 'playwright'
import {
  hashUrl,
  type LinkPreviewConfig,
  type LinkPreviewEntry,
  type LinkPreviewManifest,
} from '@/lib/link-preview'
import { getPosts, getWorkPages } from '@/lib/source'

export const linkPreviewConfig: LinkPreviewConfig & {
  contentHashPath: string
} = {
  contentHashPath: 'public/previews/.content-hash',
  imageFormat: 'jpeg',
  imageQuality: 80,
  manifestPath: 'public/previews/manifest.json',
  outputDir: 'public/previews',
  screenshotHeight: 630,
  screenshotWidth: 1200,
  timeout: 30_000,
}

const excludedDomains = [
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

const internalHostnames = new Set([
  'techwithanirudh.com',
  'www.techwithanirudh.com',
  'localhost',
])
const trailingPunctuationRegex = /[.,;:!?]+$/

export function getScreenshotFilename(url: string): string {
  return `${hashUrl(url)}.${linkPreviewConfig.imageFormat}`
}

export function shouldGeneratePreview(url: string): boolean {
  if (!(url.startsWith('http://') || url.startsWith('https://'))) {
    return false
  }

  try {
    const parsed = new URL(url)

    if (internalHostnames.has(parsed.hostname)) {
      return false
    }

    return !excludedDomains.some((domain) => parsed.hostname.includes(domain))
  } catch {
    return false
  }
}

export function extractUrlsFromText(text: string): string[] {
  const patterns = [
    /\[[^\]]+\]\((https?:\/\/[^)\s]+)\)/g,
    /href=["'](https?:\/\/[^"']+)["']/g,
    /href:\s*["'](https?:\/\/[^"']+)["']/g,
    /https?:\/\/[^\s<>"')]+/g,
  ]
  const urls = new Set<string>()

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const url = normalizeExtractedUrl(match[1] ?? match[0])

      if (url && shouldGeneratePreview(url)) {
        urls.add(url)
      }
    }
  }

  return [...urls]
}

function normalizeExtractedUrl(url: string): string {
  return url.replace(trailingPunctuationRegex, '')
}

export async function getContentEntries(): Promise<
  { content: string; path: string }[]
> {
  const pages = [...getPosts(), ...getWorkPages()]
  const entries: { content: string; path: string }[] = []

  for (const page of pages) {
    entries.push({
      content: await page.data.getText('raw'),
      path: page.data.info.fullPath,
    })
  }

  return entries
}

export async function loadManifest(): Promise<LinkPreviewManifest | null> {
  try {
    const content = await fs.readFile(linkPreviewConfig.manifestPath, 'utf8')
    return JSON.parse(content) as LinkPreviewManifest
  } catch {
    return null
  }
}

export async function writeManifest(
  previews: Record<string, LinkPreviewEntry>,
  version = '1.0'
): Promise<void> {
  await fs.mkdir(linkPreviewConfig.outputDir, { recursive: true })
  const manifest: LinkPreviewManifest = {
    generated: new Date().toISOString(),
    previews,
    version,
  }

  await fs.writeFile(
    linkPreviewConfig.manifestPath,
    `${JSON.stringify(manifest, null, 2)}\n`
  )
}

export async function loadContentHash(): Promise<string | null> {
  try {
    return await fs.readFile(linkPreviewConfig.contentHashPath, 'utf8')
  } catch {
    return null
  }
}

export async function saveContentHash(hash: string): Promise<void> {
  await fs.mkdir(path.dirname(linkPreviewConfig.contentHashPath), {
    recursive: true,
  })
  await fs.writeFile(linkPreviewConfig.contentHashPath, hash)
}

export async function captureScreenshot(
  browser: Browser,
  url: string,
  timeout = linkPreviewConfig.timeout
): Promise<{ error?: string; success: boolean }> {
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: {
      height: linkPreviewConfig.screenshotHeight,
      width: linkPreviewConfig.screenshotWidth,
    },
  })
  const page = await context.newPage()

  try {
    await page.route('**/*', (route) => {
      const resourceType = route.request().resourceType()

      if (['font', 'media', 'websocket'].includes(resourceType)) {
        route.abort()
        return
      }

      route.continue()
    })

    try {
      await page.goto(url, {
        timeout: 20_000,
        waitUntil: 'networkidle',
      })
    } catch {
      await page.goto(url, {
        timeout,
        waitUntil: 'domcontentloaded',
      })
      await page.waitForTimeout(3000)
    }

    await page.waitForTimeout(1000)

    await page.screenshot({
      path: path.join(linkPreviewConfig.outputDir, getScreenshotFilename(url)),
      quality:
        linkPreviewConfig.imageFormat === 'jpeg'
          ? linkPreviewConfig.imageQuality
          : undefined,
      type: linkPreviewConfig.imageFormat,
    })

    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false,
    }
  } finally {
    await context.close()
  }
}
