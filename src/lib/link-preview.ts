import 'server-only'

import fs from 'node:fs'
import path from 'node:path'
import { cache } from 'react'
import {
  hashUrl,
  type LinkPreviewEntry,
  type LinkPreviewImage,
  type LinkPreviewManifest,
  linkPreviewManifestSchema,
} from './link-preview.shared'

const manifestPath = path.join(
  process.cwd(),
  'public',
  'previews',
  'manifest.json'
)

const getLinkPreviewManifest = cache((): LinkPreviewManifest | null => {
  try {
    return linkPreviewManifestSchema.parse(
      JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    )
  } catch (error) {
    if (
      !(error instanceof Error && 'code' in error && error.code === 'ENOENT')
    ) {
      console.error('Could not read the link preview manifest:', error)
    }
    return null
  }
})

function getLinkPreview(url: string): LinkPreviewEntry | null {
  const manifest = getLinkPreviewManifest()
  const preview = manifest?.previews[hashUrl(url)]

  if (preview?.status !== 'success') {
    return null
  }

  return preview
}

export function getLinkPreviewImage(url: string): LinkPreviewImage | null {
  const preview = getLinkPreview(url)
  if (!preview) {
    return null
  }

  const { height, screenshotPath, width } = preview
  return { height, screenshotPath, width }
}
