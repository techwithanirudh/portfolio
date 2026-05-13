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
import { detection, exclusions, screenshot } from './config'
import type { CaptureScreenshotResult } from './types'

const mdProcessor = remark().use(remarkGfm)
const mdxProcessor = remark().use(remarkMdx).use(remarkGfm)

/** Whether a URL should have a screenshot captured (filters internal, excluded domains, etc.) */
export function shouldGeneratePreview(url: string): boolean {
  if (!(url.startsWith('http://') || url.startsWith('https://'))) {
    return false
  }

  try {
    const parsed = new URL(url)
    if (exclusions.hostnames.includes(parsed.hostname)) {
      return false
    }
    if (
      exclusions.extensions.some((e) =>
        parsed.pathname.toLowerCase().endsWith(e)
      )
    ) {
      return false
    }
    return !exclusions.domains.some((d) => parsed.hostname.includes(d))
  } catch {
    return false
  }
}

/** Extract external URLs from an MDX/MD file's markdown links and frontmatter */
export function extractUrls(file: FileObject): string[] {
  const urls = new Set<string>()
  const processor = file.path.endsWith('.mdx') ? mdxProcessor : mdProcessor
  const tree = processor.parse(file.content)

  if (file.data) {
    const fm = file.data as Record<string, unknown>
    for (const field of detection.frontmatter) {
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

      const attrs = detection.components[node.name]
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

/** Keep only preview entries whose URL hashes are present in the given URL list */
export function previewsForUrls(
  previews: Record<string, LinkPreviewEntry>,
  urls: string[]
): Record<string, LinkPreviewEntry> {
  const urlHashes = new Set(urls.map((u) => hashUrl(u)))
  return Object.fromEntries(
    Object.entries(previews).filter(([h]) => urlHashes.has(h))
  )
}

/** Load the existing preview manifest, or null if none exists */
export async function loadManifest(): Promise<LinkPreviewManifest | null> {
  try {
    return JSON.parse(await fs.readFile(screenshot.paths.manifest, 'utf8'))
  } catch {
    return null
  }
}

/** Write the preview manifest to disk, creating the output directory if needed */
export async function writeManifest(
  previews: Record<string, LinkPreviewEntry>
) {
  await fs.mkdir(screenshot.paths.output, { recursive: true })
  await fs.writeFile(
    screenshot.paths.manifest,
    `${JSON.stringify({ generated: new Date().toISOString(), previews }, null, 2)}\n`
  )
}

/** Capture a full-page screenshot of a URL, returning success or an error message */
export async function captureScreenshot(
  browser: Browser,
  url: string,
  timeout = screenshot.timeout
) {
  await fs.mkdir(screenshot.paths.output, { recursive: true })

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: {
      height: screenshot.viewport.height,
      width: screenshot.viewport.width,
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
      .goto(url, { timeout, waitUntil: 'networkidle' })
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

    await page.waitForTimeout(screenshot.waitAfterLoad)
    await page.evaluate(() => document.fonts.ready).catch(() => null)

    await page.screenshot({
      path: path.join(
        screenshot.paths.output,
        `${hashUrl(url)}.${screenshot.image.format}`
      ),
      quality:
        screenshot.image.format === 'jpeg'
          ? screenshot.image.quality
          : undefined,
      type: screenshot.image.format,
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

/** Delete screenshot files not referenced by any preview entry */
export async function removeOrphans(
  previews: Record<string, LinkPreviewEntry>
) {
  const expectedFiles = new Set(
    Object.values(previews).map((p) => path.basename(p.screenshotPath))
  )
  let files: string[]
  try {
    files = await fs.readdir(screenshot.paths.output)
  } catch {
    return
  }
  for (const file of files) {
    if (
      (file.endsWith('.jpeg') || file.endsWith('.png')) &&
      !expectedFiles.has(file)
    ) {
      await fs.unlink(path.join(screenshot.paths.output, file))
    }
  }
}

/** Create a new manifest entry for a screenshot result */
export function createEntry(
  url: string,
  result: CaptureScreenshotResult
): LinkPreviewEntry {
  return {
    errorMessage: result.error,
    generatedAt: new Date().toISOString(),
    height: screenshot.viewport.height,
    screenshotPath: `/previews/${hashUrl(url)}.${screenshot.image.format}`,
    status: result.success ? 'success' : 'failed',
    url,
    width: screenshot.viewport.width,
  }
}
