import { readFiles } from 'next-validate-link'
import { chromium } from 'playwright'
import { hashUrl, type LinkPreviewEntry } from '@/lib/link-preview'
import { content } from './config'
import {
  captureScreenshot,
  createEntry,
  extractUrls,
  loadManifest,
  previewsForUrls,
  removeOrphans,
  writeManifest,
} from './utils'

async function captureMissing(
  urls: string[],
  existing: Record<string, LinkPreviewEntry>
) {
  const previews = { ...existing }
  const browser = await chromium.launch({ headless: true })

  try {
    for (const [i, url] of urls.entries()) {
      console.log(`[${i + 1}/${urls.length}] ${url}`)
      const result = await captureScreenshot(browser, url, 45_000)
      previews[hashUrl(url)] = createEntry(url, result)
      console.log(
        result.success ? '  Success\n' : `  Failed: ${result.error}\n`
      )
    }
  } finally {
    await browser.close()
  }

  return previews
}

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

  const files = await readFiles(content)
  const urls = [...new Set(files.flatMap((f) => extractUrls(f)))]
  const currentPreviews = previewsForUrls(manifest.previews, urls)
  const pending = urls.filter((url) => {
    const existing = currentPreviews[hashUrl(url)]
    return !existing || (retryFailed && existing.status === 'failed')
  })

  console.log(
    `Read ${files.length} files, ${urls.length} URLs, processing ${pending.length}`
  )

  const previews =
    pending.length === 0
      ? currentPreviews
      : await captureMissing(pending, currentPreviews)

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
