import { readFiles } from 'next-validate-link'
import { chromium } from 'playwright'
import { hashUrl } from '@/lib/link-preview'
import { contentPatterns } from './config'
import {
  captureScreenshot,
  createEntry,
  extractUrls,
  loadManifest,
  removeOrphans,
  scopePreviewsToUrls,
  writeManifest,
} from './utils'

async function main() {
  const retryFailed = process.argv.includes('--all')
  const manifest = await loadManifest()

  console.log('Fix Failed Link Previews\n')
  console.log(
    retryFailed ? 'Mode: retry failed and missing' : 'Mode: missing only'
  )

  if (!manifest) {
    console.log('No manifest found. Run bun run generate-previews first.')
    return
  }

  const files = await readFiles(contentPatterns)
  const urls = [...new Set(files.flatMap((f) => extractUrls(f)))]
  const previews = scopePreviewsToUrls(manifest.previews, urls)
  const urlsToProcess = urls.filter((url) => {
    const existing = previews[hashUrl(url)]
    return !existing || (retryFailed && existing.status === 'failed')
  })

  console.log(
    `Read ${files.length} files, ${urls.length} URLs, processing ${urlsToProcess.length}`
  )

  if (urlsToProcess.length > 0) {
    const browser = await chromium.launch({ headless: true })

    try {
      for (const [i, url] of urlsToProcess.entries()) {
        console.log(`[${i + 1}/${urlsToProcess.length}] ${url}`)
        const result = await captureScreenshot(browser, url, 45_000)
        previews[hashUrl(url)] = createEntry(url, result)
        console.log(
          result.success ? '  Success\n' : `  Failed: ${result.error}\n`
        )
      }
    } finally {
      await browser.close()
    }
  }

  await writeManifest(previews)
  await removeOrphans(previews)

  const all = Object.values(previews)
  console.log(
    `Results: ${all.filter((p) => p.status === 'success').length} success, ${all.filter((p) => p.status === 'failed').length} failed`
  )
}

main().catch((error) => {
  console.error('Failed to fix link previews.', error)
  process.exitCode = 1
})
