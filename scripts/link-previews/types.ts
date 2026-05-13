export interface CaptureScreenshotResult {
  error?: string
  success: boolean
}

export interface ScreenshotConfig {
  image: { format: 'jpeg' | 'png'; quality: number }
  paths: { manifest: string; output: string }
  timeout: number
  viewport: { height: number; width: number }
  waitAfterLoad: number
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
