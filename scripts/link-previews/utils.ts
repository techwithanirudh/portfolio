import fs from 'node:fs/promises'
import path from 'node:path'
import type { FileObject } from 'next-validate-link'
import type { Browser } from 'playwright'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkMdx from 'remark-mdx'
import { visit } from 'unist-util-visit'
import {
  hashUrl,
  type LinkPreviewEntry,
  type LinkPreviewManifest,
} from '@/lib/link-preview'
import {
  excludedDomains,
  excludedPathExtensions,
  frontmatterUrlFields,
  internalHostnames,
  linkPreviewConfig,
  mdxComponentAttributes,
} from './config'
import type { CaptureScreenshotResult } from './types'

const mdProcessor = remark().use(remarkGfm)
const mdxProcessor = remark().use(remarkMdx).use(remarkGfm)

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
      excludedPathExtensions.some((e) =>
        parsed.pathname.toLowerCase().endsWith(e)
      )
    ) {
      return false
    }
    return !excludedDomains.some((d) => parsed.hostname.includes(d))
  } catch {
    return false
  }
}

export function extractUrls(file: FileObject): string[] {
  const urls = new Set<string>()
  const processor = file.path.endsWith('.mdx') ? mdxProcessor : mdProcessor
  const tree = processor.parse(file.content)

  if (file.data) {
    const fm = file.data as Record<string, unknown>
    for (const field of frontmatterUrlFields) {
      const v = fm[field]
      if (typeof v === 'string' && shouldGeneratePreview(v)) {
        urls.add(v)
      }
    }
  }

  visit(
    tree,
    (node: {
      type: string
      url?: unknown
      name?: unknown
      attributes?: { type: string; name?: unknown; value?: unknown }[]
    }) => {
      if (
        node.type === 'link' &&
        typeof node.url === 'string' &&
        shouldGeneratePreview(node.url)
      ) {
        urls.add(node.url)
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

      const attrs = mdxComponentAttributes[node.name]
      if (!attrs) {
        return
      }

      for (const attr of node.attributes ?? []) {
        if (
          attr.type === 'mdxJsxAttribute' &&
          typeof attr.name === 'string' &&
          typeof attr.value === 'string' &&
          attrs.includes(attr.name) &&
          shouldGeneratePreview(attr.value)
        ) {
          urls.add(attr.value)
        }
      }
    }
  )

  return [...urls]
}

export function scopePreviewsToUrls(
  previews: Record<string, LinkPreviewEntry>,
  urls: string[]
): Record<string, LinkPreviewEntry> {
  const urlHashes = new Set(urls.map((u) => hashUrl(u)))
  return Object.fromEntries(
    Object.entries(previews).filter(([h]) => urlHashes.has(h))
  )
}

export async function loadManifest(): Promise<LinkPreviewManifest | null> {
  try {
    return JSON.parse(await fs.readFile(linkPreviewConfig.manifestPath, 'utf8'))
  } catch {
    return null
  }
}

export async function writeManifest(
  previews: Record<string, LinkPreviewEntry>
) {
  await fs.mkdir(linkPreviewConfig.outputDir, { recursive: true })
  await fs.writeFile(
    linkPreviewConfig.manifestPath,
    `${JSON.stringify({ generated: new Date().toISOString(), previews }, null, 2)}\n`
  )
}

export async function captureScreenshot(
  browser: Browser,
  url: string,
  timeout = linkPreviewConfig.timeout
) {
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
      if (['media', 'websocket'].includes(route.request().resourceType())) {
        route.abort()
      } else {
        route.continue()
      }
    })

    let response = await page
      .goto(url, { timeout: 20_000, waitUntil: 'networkidle' })
      .catch(() => null)
    if (!response) {
      response = await page.goto(url, {
        timeout,
        waitUntil: 'domcontentloaded',
      })
      await page.waitForTimeout(3000)
    }

    if (response && response.status() >= 400) {
      return { error: `HTTP ${response.status()}`, success: false }
    }

    await page.waitForTimeout(1000)
    await page
      .evaluate(() => document.fonts.ready)
      .catch(() => {
        /* Font Loading API may be polyfilled */
      })

    await page.screenshot({
      path: path.join(
        linkPreviewConfig.outputDir,
        `${hashUrl(url)}.${linkPreviewConfig.imageFormat}`
      ),
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

export async function removeOrphans(
  previews: Record<string, LinkPreviewEntry>
) {
  const expectedFiles = new Set(
    Object.values(previews).map((p) => path.basename(p.screenshotPath))
  )
  let files: string[]
  try {
    files = await fs.readdir(linkPreviewConfig.outputDir)
  } catch {
    return
  }
  for (const file of files) {
    if (
      (file.endsWith('.jpeg') || file.endsWith('.png')) &&
      !expectedFiles.has(file)
    ) {
      await fs.unlink(path.join(linkPreviewConfig.outputDir, file))
    }
  }
}

export function createEntry(
  url: string,
  result: CaptureScreenshotResult
): LinkPreviewEntry {
  return {
    errorMessage: result.error,
    generatedAt: new Date().toISOString(),
    height: linkPreviewConfig.screenshotHeight,
    screenshotPath: `/previews/${hashUrl(url)}.${linkPreviewConfig.imageFormat}`,
    status: result.success ? 'success' : 'failed',
    url,
    width: linkPreviewConfig.screenshotWidth,
  }
}
