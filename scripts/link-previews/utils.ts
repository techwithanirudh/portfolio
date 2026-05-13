import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { FileObject } from 'next-validate-link'
import type { Browser } from 'playwright'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkMdx from 'remark-mdx'
import {
  hashUrl,
  type LinkPreviewEntry,
  type LinkPreviewManifest,
} from '@/lib/link-preview'
import {
  excludedDomains,
  excludedPathExtensions,
  extractionVersion,
  frontmatterUrlFields,
  internalHostnames,
  linkPreviewConfig,
  mdxComponentAttributes,
} from './config'
import type { CaptureScreenshotResult, MarkdownNode } from './types'

const mdProcessor = remark().use(remarkGfm)
const mdxProcessor = remark().use(remarkMdx).use(remarkGfm)

export function getScreenshotFilename(url: string): string {
  return `${hashUrl(url)}.${linkPreviewConfig.imageFormat}`
}

export function createPreviewEntry(
  url: string,
  result: CaptureScreenshotResult
): LinkPreviewEntry {
  return {
    errorMessage: result.error,
    generatedAt: new Date().toISOString(),
    height: linkPreviewConfig.screenshotHeight,
    screenshotPath: `/previews/${getScreenshotFilename(url)}`,
    status: result.success ? 'success' : 'failed',
    url,
    width: linkPreviewConfig.screenshotWidth,
  }
}

export function extractPreviewUrls(files: FileObject[]): string[] {
  return [...new Set(files.flatMap((file) => extractUrlsFromFile(file)))]
}

export function scopePreviewsToUrls(
  previews: Record<string, LinkPreviewEntry>,
  urls: string[]
): Record<string, LinkPreviewEntry> {
  const urlHashes = new Set(urls.map((url) => hashUrl(url)))

  return Object.fromEntries(
    Object.entries(previews).filter(([hash]) => urlHashes.has(hash))
  )
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

    if (
      excludedPathExtensions.some((extension) =>
        parsed.pathname.toLowerCase().endsWith(extension)
      )
    ) {
      return false
    }

    return !excludedDomains.some((domain) => parsed.hostname.includes(domain))
  } catch {
    return false
  }
}

export function extractUrlsFromFile(file: FileObject): string[] {
  const urls = new Set<string>()
  const processor = file.path.endsWith('.mdx') ? mdxProcessor : mdProcessor
  const tree = processor.parse(file.content) as MarkdownNode

  addFrontmatterUrls(urls, file.data)

  visitMarkdownNode(tree, (node) => {
    if (node.type === 'link' && typeof node.url === 'string') {
      addUrl(urls, node.url)
      return
    }

    if (
      node.type !== 'mdxJsxFlowElement' &&
      node.type !== 'mdxJsxTextElement'
    ) {
      return
    }

    if (typeof node.name !== 'string') {
      return
    }

    const attributes = mdxComponentAttributes[node.name]

    if (!attributes) {
      return
    }

    for (const attribute of node.attributes ?? []) {
      if (
        attribute.type === 'mdxJsxAttribute' &&
        typeof attribute.name === 'string' &&
        attributes.includes(attribute.name) &&
        typeof attribute.value === 'string'
      ) {
        addUrl(urls, attribute.value)
      }
    }
  })

  return [...urls]
}

function addFrontmatterUrls(urls: Set<string>, data: object | undefined) {
  if (!data) {
    return
  }

  const frontmatter = data as Record<string, unknown>

  for (const field of frontmatterUrlFields) {
    const value = frontmatter[field]

    if (typeof value === 'string') {
      addUrl(urls, value)
    }
  }
}

export function generateContentHash(files: FileObject[]): string {
  const hash = crypto.createHash('sha256')

  hash.update(extractionVersion)
  hash.update(JSON.stringify(frontmatterUrlFields))

  for (const file of files) {
    hash.update(file.path)
    hash.update(file.content)
  }

  return hash.digest('hex')
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
): Promise<CaptureScreenshotResult> {
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

      if (['media', 'websocket'].includes(resourceType)) {
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
    await page
      .evaluate(() => document.fonts.ready)
      .catch(() => {
        // Some pages disable or polyfill the Font Loading API. Continue with the screenshot.
      })

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

export async function removeOrphanedScreenshots(
  previews: Record<string, LinkPreviewEntry>
): Promise<void> {
  const expectedFiles = new Set(
    Object.values(previews).map((preview) =>
      path.basename(preview.screenshotPath)
    )
  )

  let files: string[]
  try {
    files = await fs.readdir(linkPreviewConfig.outputDir)
  } catch {
    return
  }

  for (const file of files) {
    if (!(file.endsWith('.jpeg') || file.endsWith('.png'))) {
      continue
    }

    if (expectedFiles.has(file)) {
      continue
    }

    await fs.unlink(path.join(linkPreviewConfig.outputDir, file))
  }
}

function addUrl(urls: Set<string>, url: string) {
  if (shouldGeneratePreview(url)) {
    urls.add(url)
  }
}

function visitMarkdownNode(
  node: MarkdownNode,
  visitor: (node: MarkdownNode) => void
) {
  visitor(node)

  for (const child of node.children ?? []) {
    visitMarkdownNode(child, visitor)
  }
}
