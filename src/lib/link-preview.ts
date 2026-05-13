import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { cache } from 'react'

const wwwPrefixRegex = /^www\./

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
  version: string
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
    return JSON.parse(
      fs.readFileSync(manifestPath, 'utf8')
    ) as LinkPreviewManifest
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

export function getDisplayUrl(url: string): string {
  try {
    const parsed = new URL(url)
    return parsed.hostname.replace(wwwPrefixRegex, '')
  } catch {
    return url
  }
}

export function isExternalHttpUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://')
}
