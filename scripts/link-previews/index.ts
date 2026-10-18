import fs from 'node:fs/promises'
import { parseArgs } from 'node:util'
import { chromium } from 'playwright'
import { hashUrl, type LinkPreviewEntry } from '@/lib/link-preview.shared'
import { concurrency, maxScreenshotAgeMs, screenshot } from './config'
import {
  captureScreenshot,
  collectUrls,
  createEntry,
  loadManifest,
  previewsForUrls,
  removeOrphans,
  writeManifest,
} from './utils'

interface Mode {
  batchSize: number
  isPending: (entry: LinkPreviewEntry | undefined) => boolean
  label: string
  requiresManifest: boolean
  timeout: number
}

const isStale = (entry: LinkPreviewEntry) =>
  Date.now() - new Date(entry.generatedAt).getTime() > maxScreenshotAgeMs

const modes = {
  missing: {
    batchSize: 1,
    isPending: (entry) => !entry,
    label: 'missing only',
    requiresManifest: true,
    timeout: screenshot.retryTimeout,
  },
  refresh: {
    batchSize: concurrency,
    isPending: (entry) =>
      !entry || (entry.status !== 'failed' && isStale(entry)),
    label: 'missing and stale',
    requiresManifest: false,
    timeout: screenshot.timeout,
  },
  retryFailed: {
    batchSize: 1,
    isPending: (entry) => !entry || entry.status === 'failed',
    label: 'retry failed and missing',
    requiresManifest: true,
    timeout: screenshot.retryTimeout,
  },
} satisfies Record<string, Mode>

function readMode(): Mode {
  const { values } = parseArgs({
    options: {
      missing: { type: 'boolean' },
      'retry-failed': { type: 'boolean' },
    },
  })

  if (values['retry-failed']) {
    return modes.retryFailed
  }
  if (values.missing) {
    return modes.missing
  }
  return modes.refresh
}

async function capture(
  urls: string[],
  existing: Record<string, LinkPreviewEntry>,
  { batchSize, timeout }: Mode
) {
  const previews = { ...existing }
  const browser = await chromium.launch({ headless: true })
  let done = 0

  try {
    for (let i = 0; i < urls.length; i += batchSize) {
      await Promise.all(
        urls.slice(i, i + batchSize).map(async (url) => {
          const result = await captureScreenshot(browser, url, timeout)
          previews[hashUrl(url)] = createEntry(url, result)
          done += 1
          console.log(
            `[${done}/${urls.length}] ${url}\n  ${result.success ? 'Success' : `Failed: ${result.error}`}`
          )
        })
      )
    }
  } finally {
    await browser.close()
  }

  return previews
}

async function main() {
  const mode = readMode()
  console.log(`Link previews (${mode.label})\n`)

  const manifest = await loadManifest()
  if (!manifest && mode.requiresManifest) {
    throw new Error('No manifest found. Run bun run generate-previews first.')
  }

  const { fileCount, urls } = await collectUrls()
  const currentPreviews = previewsForUrls(manifest?.previews ?? {}, urls)
  const pending = urls.filter((url) =>
    mode.isPending(currentPreviews[hashUrl(url)])
  )

  console.log(
    `Read ${fileCount} files, ${urls.length} URLs, processing ${pending.length}`
  )

  await fs.mkdir(screenshot.paths.output, { recursive: true })
  const previews =
    pending.length === 0
      ? currentPreviews
      : await capture(pending, currentPreviews, mode)

  await writeManifest(previews)
  await removeOrphans(previews)

  const all = Object.values(previews)
  console.log(
    `\nSummary: ${all.length} total, ${all.filter((p) => p.status === 'success').length} success, ${all.filter((p) => p.status === 'failed').length} failed`
  )
}

main().catch((error) => {
  console.error('Failed to update link previews.', error)
  process.exitCode = 1
})
