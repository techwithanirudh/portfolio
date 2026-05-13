import { chromium } from 'playwright'
import { hashUrl } from '@/lib/link-preview'
import {
  captureScreenshot,
  extractUrlsFromText,
  getContentEntries,
  getScreenshotFilename,
  linkPreviewConfig,
  loadManifest,
  writeManifest,
} from './link-preview-utils'

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

  const entries = await getContentEntries()
  const urls = [
    ...new Set(entries.flatMap((entry) => extractUrlsFromText(entry.content))),
  ]
  const previews = { ...manifest.previews }
  const urlsToProcess = urls.filter((url) => {
    const existing = previews[hashUrl(url)]

    return !existing || (retryFailed && existing.status === 'failed')
  })

  console.log(`Found ${urls.length} external URLs in content`)
  console.log(`Processing ${urlsToProcess.length} URLs\n`)

  if (urlsToProcess.length === 0) {
    return
  }

  const browser = await chromium.launch({ headless: true })

  try {
    for (const [index, url] of urlsToProcess.entries()) {
      console.log(`[${index + 1}/${urlsToProcess.length}] ${url}`)
      const result = await captureScreenshot(browser, url, 45_000)

      previews[hashUrl(url)] = {
        errorMessage: result.error,
        generatedAt: new Date().toISOString(),
        height: linkPreviewConfig.screenshotHeight,
        screenshotPath: `/previews/${getScreenshotFilename(url)}`,
        status: result.success ? 'success' : 'failed',
        url,
        width: linkPreviewConfig.screenshotWidth,
      }

      console.log(
        result.success ? '  Success\n' : `  Failed: ${result.error}\n`
      )
    }
  } finally {
    await browser.close()
  }

  await writeManifest(previews, manifest.version)

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
