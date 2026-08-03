import 'server-only'

import fs from 'node:fs'
import path from 'node:path'
import { cache } from 'react'
import {
  hashUrl,
  type LinkPreviewEntry,
  type LinkPreviewManifest,
} from './link-preview.shared'

export type {
  LinkPreviewEntry,
  LinkPreviewManifest,
} from './link-preview.shared'
export { hashUrl } from './link-preview.shared'

const manifestPath = path.join(
  process.cwd(),
  'public',
  'previews',
  'manifest.json'
)

export const getLinkPreviewManifest = cache((): LinkPreviewManifest | null => {
  if (!fs.existsSync(manifestPath)) {
    return null
  }

  try {
    return JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  } catch {
    return null
  }
})

export function getLinkPreview(url: string): LinkPreviewEntry | null {
  const manifest = getLinkPreviewManifest()
  const preview = manifest?.previews[hashUrl(url)]

  if (preview?.status !== 'success') {
    return null
  }

  return preview
}
