import crypto from 'node:crypto'
import { chromium } from 'playwright'
import { hashUrl, type LinkPreviewEntry } from '@/lib/link-preview'
import {
  captureScreenshot,
  extractUrlsFromText,
  getContentEntries,
  getScreenshotFilename,
  linkPreviewConfig,
  loadContentHash,
  loadManifest,
  saveContentHash,
  writeManifest,
} from './link-preview-utils'

const maxScreenshotAgeMs = 6 * 30 * 24 * 60 * 60 * 1000
const concurrency = 3
const extractionVersion = 'bare-url-v1'

function generateContentHash(entries: { content: string; path: string }[]) {
  const hash = crypto.createHash('sha256')

  hash.update(extractionVersion)

  for (const entry of entries) {
    hash.update(entry.path)
    hash.update(entry.content)
  }

  return hash.digest('hex')
}

async function processUrls(
  urls: string[],
  existingPreviews: Record<string, LinkPreviewEntry>
) {
  const previews: Record<string, LinkPreviewEntry> = { ...existingPreviews }
  const browser = await chromium.launch({ headless: true })

  try {
    for (let index = 0; index < urls.length; index += concurrency) {
      const batch = urls.slice(index, index + concurrency)
      const batchNumber = Math.floor(index / concurrency) + 1
      const batchTotal = Math.ceil(urls.length / concurrency)

      console.log(`Processing batch ${batchNumber}/${batchTotal}`)

      await Promise.all(
        batch.map(async (url) => {
          console.log(`  Capturing: ${url}`)
          const result = await captureScreenshot(browser, url)
          const hash = hashUrl(url)

          previews[hash] = {
            errorMessage: result.error,
            generatedAt: new Date().toISOString(),
            height: linkPreviewConfig.screenshotHeight,
            screenshotPath: `/previews/${getScreenshotFilename(url)}`,
            status: result.success ? 'success' : 'failed',
            url,
            width: linkPreviewConfig.screenshotWidth,
          }

          console.log(
            result.success ? '    Success' : `    Failed: ${result.error}`
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
  const startedAt = Date.now()
  console.log('Link Preview Generator\n')

  const manifest = await loadManifest()
  const existingPreviews = manifest?.previews ?? {}
  const entries = await getContentEntries()
  const contentHash = generateContentHash(entries)

  if ((await loadContentHash()) === contentHash && manifest) {
    console.log(
      `No content changes detected. Skipping. (${Date.now() - startedAt}ms)`
    )
    return
  }

  const urls = [
    ...new Set(entries.flatMap((entry) => extractUrlsFromText(entry.content))),
  ]

  console.log(`Found ${urls.length} unique external URLs`)

  const urlsToProcess = urls.filter((url) => {
    const existing = existingPreviews[hashUrl(url)]

    if (!existing) {
      return true
    }

    if (existing.status === 'failed') {
      return false
    }

    return (
      Date.now() - new Date(existing.generatedAt).getTime() > maxScreenshotAgeMs
    )
  })

  console.log(`Processing ${urlsToProcess.length} new or stale URLs\n`)

  if (urlsToProcess.length === 0) {
    await writeManifest(existingPreviews, manifest?.version)
    await saveContentHash(contentHash)
    return
  }

  const previews = await processUrls(urlsToProcess, existingPreviews)
  await writeManifest(previews, manifest?.version)
  await saveContentHash(contentHash)

  const successful = Object.values(previews).filter(
    (preview) => preview.status === 'success'
  ).length
  const failed = Object.values(previews).filter(
    (preview) => preview.status === 'failed'
  ).length

  console.log('\nSummary:')
  console.log(`  Total previews: ${Object.values(previews).length}`)
  console.log(`  Successful: ${successful}`)
  console.log(`  Failed: ${failed}`)
  console.log(`  Manifest written to ${linkPreviewConfig.manifestPath}`)
}

main().catch((error) => {
  console.error('Failed to generate link previews.', error)
  process.exitCode = 1
})
