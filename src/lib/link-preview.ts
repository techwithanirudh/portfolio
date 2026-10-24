import 'server-only'

import fs from 'node:fs'
import path from 'node:path'
import { cache } from 'react'
import {
  hashUrl,
  type LinkPreviewImage,
  type LinkPreviewManifest,
  linkPreviewManifestSchema,
} from './link-preview.shared'

const getLinkPreviewManifest = cache((): LinkPreviewManifest | null => {
  try {
    return linkPreviewManifestSchema.parse(
      JSON.parse(
        fs.readFileSync(
          path.join(process.cwd(), 'public', 'previews', 'manifest.json'),
          'utf8'
        )
      )
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

export function getLinkPreviewImage(url: string): LinkPreviewImage | null {
  const preview = getLinkPreviewManifest()?.previews[hashUrl(url)]
  if (preview?.status !== 'success') {
    return null
  }

  const { height, screenshotPath, width } = preview
  return { height, screenshotPath, width }
}
