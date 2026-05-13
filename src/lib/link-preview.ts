import 'server-only'

import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { cache } from 'react'

export interface LinkPreviewEntry {
  errorMessage?: string
  generatedAt: string
  height: number
  screenshotPath: string
  status: 'failed' | 'success'
  url: string
  width: number
}

export interface LinkPreviewManifest {
  generated: string
  previews: Record<string, LinkPreviewEntry>
}

const manifestPath = path.join(
  process.cwd(),
  'public',
  'previews',
  'manifest.json'
)

export function hashUrl(url: string): string {
  return crypto.createHash('sha256').update(url).digest('hex').slice(0, 12)
}

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

  if (!preview || preview.status !== 'success') {
    return null
  }

  return preview
}
