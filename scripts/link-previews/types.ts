import type { LinkPreviewConfig } from '@/lib/link-preview'

export interface LinkPreviewScriptConfig extends LinkPreviewConfig {
  contentHashPath: string
}

export interface CaptureScreenshotResult {
  error?: string
  success: boolean
}

export interface MarkdownNode {
  attributes?: MdxJsxAttribute[]
  children?: MarkdownNode[]
  name?: unknown
  type: string
  url?: unknown
}

export interface MdxJsxAttribute {
  name?: unknown
  type: string
  value?: unknown
}
