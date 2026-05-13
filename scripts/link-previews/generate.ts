import { readFiles } from 'next-validate-link'
import { chromium } from 'playwright'
import { hashUrl, type LinkPreviewEntry } from '@/lib/link-preview'
import { concurrency, content, maxScreenshotAgeMs } from './config'
import {
  captureScreenshot,
  createEntry,
  extractUrls,
  loadManifest,
  previewsForUrls,
  removeOrphans,
  writeManifest,
} from './utils'

async function processUrls(
  urls: string[],
  existing: Record<string, LinkPreviewEntry>
) {
  const previews = { ...existing }
  const browser = await chromium.launch({ headless: true })

  try {
    for (let i = 0; i < urls.length; i += concurrency) {
      const batch = urls.slice(i, i + concurrency)
      console.log(
        `Processing batch ${i / concurrency + 1}/${Math.ceil(urls.length / concurrency)}`
      )

      await Promise.all(
        batch.map(async (url) => {
          console.log(`  Capturing: ${url}`)
          const result = await captureScreenshot(browser, url)
          previews[hashUrl(url)] = createEntry(url, result)
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
  console.log('Link Preview Generator\n')

  const manifest = await loadManifest()
  const existingPreviews = manifest?.previews ?? {}
  const files = await readFiles(content)
  const urls = [...new Set(files.flatMap((f) => extractUrls(f)))]

  console.log(`Read ${files.length} content files, ${urls.length} URLs`)

  const currentPreviews = previewsForUrls(existingPreviews, urls)
  const pending = urls.filter((url) => {
    const existing = currentPreviews[hashUrl(url)]
    return (
      !existing ||
      (existing.status !== 'failed' &&
        Date.now() - new Date(existing.generatedAt).getTime() >
          maxScreenshotAgeMs)
    )
  })

  const previews =
    pending.length === 0
      ? currentPreviews
      : await processUrls(pending, currentPreviews)

  await writeManifest(previews)
  await removeOrphans(previews)

  const all = Object.values(previews)
  console.log(
    `\nSummary: ${all.length} total, ${all.filter((p) => p.status === 'success').length} success, ${all.filter((p) => p.status === 'failed').length} failed`
  )
}

main().catch((error) => {
  console.error('Failed to generate link previews.', error)
  process.exitCode = 1
})
