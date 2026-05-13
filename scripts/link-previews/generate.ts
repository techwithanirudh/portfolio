import { readFiles } from 'next-validate-link'
import { chromium } from 'playwright'
import { hashUrl, type LinkPreviewEntry } from '@/lib/link-preview'
import {
  concurrency,
  contentPatterns,
  linkPreviewConfig,
  maxScreenshotAgeMs,
} from './config'
import {
  captureScreenshot,
  createPreviewEntry,
  extractPreviewUrls,
  generateContentHash,
  loadContentHash,
  loadManifest,
  removeOrphanedScreenshots,
  saveContentHash,
  scopePreviewsToUrls,
  writeManifest,
} from './utils'

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

          previews[hashUrl(url)] = createPreviewEntry(url, result)

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
  const files = await readFiles(contentPatterns)
  const contentHash = generateContentHash(files)

  if ((await loadContentHash()) === contentHash && manifest) {
    console.log(
      `No content changes detected. Skipping. (${Date.now() - startedAt}ms)`
    )
    return
  }

  const urls = extractPreviewUrls(files)

  console.log(`Read ${files.length} content files`)
  console.log(`Found ${urls.length} unique external URLs`)

  const scopedPreviews = scopePreviewsToUrls(existingPreviews, urls)

  const urlsToProcess = urls.filter((url) => {
    const existing = scopedPreviews[hashUrl(url)]

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
    await writeManifest(scopedPreviews, manifest?.version)
    await removeOrphanedScreenshots(scopedPreviews)
    await saveContentHash(contentHash)
    return
  }

  const previews = await processUrls(urlsToProcess, scopedPreviews)
  await writeManifest(previews, manifest?.version)
  await removeOrphanedScreenshots(previews)
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
