import { readFiles } from 'next-validate-link'
import { chromium } from 'playwright'
import { hashUrl } from '@/lib/link-preview'
import { contentPatterns } from './config'
import {
  captureScreenshot,
  createPreviewEntry,
  extractPreviewUrls,
  loadManifest,
  removeOrphanedScreenshots,
  scopePreviewsToUrls,
  writeManifest,
} from './utils'

async function main() {
  const retryFailed = process.argv.includes('--all')
  const manifest = await loadManifest()

  console.log('Fix Failed Link Previews\n')
  console.log(
    retryFailed
      ? 'Mode: retry failed and missing screenshots'
      : 'Mode: generate missing screenshots only'
  )

  if (!manifest) {
    console.log('No manifest found. Run bun run generate-previews first.')
    return
  }

  const files = await readFiles(contentPatterns)
  const urls = extractPreviewUrls(files)
  const previews = scopePreviewsToUrls(manifest.previews, urls)
  const urlsToProcess = urls.filter((url) => {
    const existing = previews[hashUrl(url)]

    return !existing || (retryFailed && existing.status === 'failed')
  })

  console.log(`Read ${files.length} content files`)
  console.log(`Found ${urls.length} external URLs in content`)
  console.log(`Processing ${urlsToProcess.length} URLs\n`)

  if (urlsToProcess.length === 0) {
    await writeManifest(previews, manifest.version)
    await removeOrphanedScreenshots(previews)
    return
  }

  const browser = await chromium.launch({ headless: true })

  try {
    for (const [index, url] of urlsToProcess.entries()) {
      console.log(`[${index + 1}/${urlsToProcess.length}] ${url}`)
      const result = await captureScreenshot(browser, url, 45_000)

      previews[hashUrl(url)] = createPreviewEntry(url, result)

      console.log(
        result.success ? '  Success\n' : `  Failed: ${result.error}\n`
      )
    }
  } finally {
    await browser.close()
  }

  await writeManifest(previews, manifest.version)
  await removeOrphanedScreenshots(previews)

  const successful = Object.values(previews).filter(
    (preview) => preview.status === 'success'
  ).length
  const failed = Object.values(previews).filter(
    (preview) => preview.status === 'failed'
  ).length

  console.log('Results:')
  console.log(`  Successful: ${successful}`)
  console.log(`  Failed: ${failed}`)
}

main().catch((error) => {
  console.error('Failed to fix link previews.', error)
  process.exitCode = 1
})
