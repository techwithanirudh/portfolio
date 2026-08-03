import crypto from 'node:crypto'

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

export function hashUrl(url: string): string {
  return crypto.createHash('sha256').update(url).digest('hex').slice(0, 12)
}
