import crypto from 'node:crypto'
import { z } from 'zod'

const linkPreviewEntrySchema = z.object({
  errorMessage: z.string().optional(),
  generatedAt: z.string(),
  height: z.number(),
  screenshotPath: z.string(),
  status: z.enum(['failed', 'success']),
  url: z.string(),
  width: z.number(),
})

export const linkPreviewManifestSchema = z.object({
  generated: z.string(),
  previews: z.record(z.string(), linkPreviewEntrySchema),
})

export type LinkPreviewEntry = z.infer<typeof linkPreviewEntrySchema>

export type LinkPreviewImage = Pick<
  LinkPreviewEntry,
  'height' | 'screenshotPath' | 'width'
>

export type LinkPreviewManifest = z.infer<typeof linkPreviewManifestSchema>

export function hashUrl(url: string): string {
  return crypto.createHash('sha256').update(url).digest('hex').slice(0, 12)
}
