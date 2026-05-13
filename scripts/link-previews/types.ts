export interface CaptureScreenshotResult {
  error?: string
  success: boolean
}

export interface ScreenshotConfig {
  timeout: number
  waitAfterLoad: number
  viewport: { height: number; width: number }
  paths: { manifest: string; output: string }
  image: { format: 'jpeg' | 'png'; quality: number }
}

export interface ExclusionsConfig {
  domains: string[]
  extensions: string[]
  hostnames: string[]
}

export interface DetectionConfig {
  components: Record<string, string[]>
  frontmatter: string[]
}
