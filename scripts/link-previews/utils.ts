import fs from 'node:fs/promises'
import path from 'node:path'
import { type FileObject, readFiles } from 'next-validate-link'
import type { Browser, Page, Response } from 'playwright'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkMdx from 'remark-mdx'
import { visit } from 'unist-util-visit'
import {
  hashUrl,
  type LinkPreviewEntry,
  type LinkPreviewManifest,
  linkPreviewManifestSchema,
} from '@/lib/link-preview.shared'
import {
  contentGlobs,
  exclusions,
  frontmatterLinks,
  previewLinkSourceGlobs,
  screenshot,
} from './config'

const mdProcessor = remark().use(remarkGfm)
const mdxProcessor = remark().use(remarkMdx).use(remarkGfm)

function shouldGeneratePreview(url: string): boolean {
  const parsed = URL.parse(url)
  if (
    !parsed ||
    (parsed.protocol !== 'http:' && parsed.protocol !== 'https:')
  ) {
    return false
  }
  if (exclusions.hostnames.includes(parsed.hostname)) {
    return false
  }
  if (
    exclusions.extensions.some((e) => parsed.pathname.toLowerCase().endsWith(e))
  ) {
    return false
  }
  return !exclusions.domains.some(
    (d) => parsed.hostname === d || parsed.hostname.endsWith(`.${d}`)
  )
}

function extractUrls(file: FileObject): string[] {
  const urls = new Set<string>()
  const processor = file.path.endsWith('.mdx') ? mdxProcessor : mdProcessor
  const tree = processor.parse(file.content)

  const frontmatter = frontmatterLinks.safeParse(file.data)
  if (frontmatter.success) {
    for (const url of Object.values(frontmatter.data)) {
      if (url && shouldGeneratePreview(url)) {
        urls.add(url)
      }
    }
  }

  visit(tree, 'link', (node) => {
    if (shouldGeneratePreview(node.url)) {
      urls.add(node.url)
    }
  })

  return [...urls]
}

const sourceUrlPattern = /(?:['"`]|\]\()(https?:\/\/[^'"`\s$)]+)(?=['"`)])/g

function extractSourceUrls(source: string): string[] {
  return [...source.matchAll(sourceUrlPattern)]
    .map(([, url]) => url)
    .filter((url): url is string => Boolean(url && shouldGeneratePreview(url)))
}

export async function collectUrls() {
  const files = await readFiles(contentGlobs)
  const sourceFiles = await Array.fromAsync(fs.glob(previewLinkSourceGlobs))
  const sourceTexts = await Promise.all(
    sourceFiles.map((file) => fs.readFile(file, 'utf8'))
  )
  const urls = new Set([
    ...files.flatMap((f) => extractUrls(f)),
    ...sourceTexts.flatMap((text) => extractSourceUrls(text)),
  ])

  return {
    fileCount: files.length + sourceFiles.length,
    urls: [...urls],
  }
}

export function previewsForUrls(
  previews: Record<string, LinkPreviewEntry>,
  urls: string[]
): Record<string, LinkPreviewEntry> {
  const urlHashes = new Set(urls.map((u) => hashUrl(u)))
  return Object.fromEntries(
    Object.entries(previews).filter(([h]) => urlHashes.has(h))
  )
}

export async function loadManifest(): Promise<LinkPreviewManifest | null> {
  let text: string
  try {
    text = await fs.readFile(screenshot.paths.manifest, 'utf8')
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return null
    }
    throw error
  }

  return linkPreviewManifestSchema.parse(JSON.parse(text))
}

export async function writeManifest(
  previews: Record<string, LinkPreviewEntry>
) {
  await fs.writeFile(
    screenshot.paths.manifest,
    `${JSON.stringify({ generated: new Date().toISOString(), previews }, null, 2)}\n`
  )
}

export type CaptureResult =
  | { success: true }
  | { error: string; success: false }

async function gotoWithFallback(
  page: Page,
  url: string,
  timeout: number
): Promise<Response | null> {
  try {
    return await page.goto(url, { timeout, waitUntil: 'networkidle' })
  } catch (networkIdleError) {
    let response: Response | null
    try {
      response = await page.goto(url, {
        timeout,
        waitUntil: 'domcontentloaded',
      })
    } catch {
      throw networkIdleError
    }
    await page.waitForTimeout(screenshot.waitAfterFallback)
    return response
  }
}

export async function captureScreenshot(
  browser: Browser,
  url: string,
  timeout: number
): Promise<CaptureResult> {
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: screenshot.viewport,
  })
  const page = await context.newPage()

  try {
    await page.route('**/*', (route) =>
      ['media', 'websocket'].includes(route.request().resourceType())
        ? route.abort()
        : route.continue()
    )

    const response = await gotoWithFallback(page, url, timeout)

    if (response && response.status() >= 400) {
      return { error: `HTTP ${response.status()}`, success: false }
    }

    await page.waitForTimeout(screenshot.waitAfterLoad)
    await page
      .evaluate(async () => {
        await document.fonts.ready
      })
      .catch((error: unknown) => {
        console.warn(`  Fonts did not settle for ${url}:`, error)
      })

    await page.screenshot({
      path: path.join(
        screenshot.paths.output,
        `${hashUrl(url)}.${screenshot.image.format}`
      ),
      quality: screenshot.image.quality,
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

export async function removeOrphans(
  previews: Record<string, LinkPreviewEntry>
) {
  const expectedFiles = new Set(
    Object.values(previews).map((p) => path.basename(p.screenshotPath))
  )
  const files = await fs.readdir(screenshot.paths.output)
  for (const file of files) {
    if (
      file.endsWith(`.${screenshot.image.format}`) &&
      !expectedFiles.has(file)
    ) {
      await fs.unlink(path.join(screenshot.paths.output, file))
    }
  }
}

export function createEntry(
  url: string,
  result: CaptureResult
): LinkPreviewEntry {
  return {
    errorMessage: result.success ? undefined : result.error,
    generatedAt: new Date().toISOString(),
    height: screenshot.viewport.height,
    screenshotPath: `${screenshot.paths.publicPath}/${hashUrl(url)}.${screenshot.image.format}`,
    status: result.success ? 'success' : 'failed',
    url,
    width: screenshot.viewport.width,
  }
}
