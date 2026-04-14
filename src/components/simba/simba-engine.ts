export type AnimationDef = {
  row: number
  frames: number
  fps: number
  loop: boolean
}

export type AgentConfig = {
  frameWidth: number
  frameHeight: number
  sheetCols: number
  sheetRows: number
  scale: number
  animations: Record<string, AnimationDef>
}

/**
 * Drives a row-based sprite-sheet animation at a fixed fps.
 * Calls `onFrame(x, y)` with scaled background-position offsets each tick.
 * Non-looping animations fire `onComplete` when the last frame finishes.
 */
export class SimbaEngine {
  private timer: ReturnType<typeof setTimeout> | null = null
  private frameIndex = 0
  private current: AnimationDef | null = null
  private onComplete: (() => void) | undefined
  private config: AgentConfig | null = null
  private readonly onFrame: (x: number, y: number) => void

  constructor(onFrame: (x: number, y: number) => void) {
    this.onFrame = onFrame
  }

  setConfig(config: AgentConfig): void {
    this.config = config
  }

  play(anim: AnimationDef, onComplete?: () => void): void {
    this.stop()
    this.current = anim
    this.onComplete = onComplete
    this.frameIndex = 0
    this.tick()
  }

  stop(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer)
      this.timer = null
    }
    this.current = null
    this.onComplete = undefined
  }

  private tick(): void {
    const anim = this.current
    const config = this.config
    if (!anim || !config) return

    const scale = config.scale
    const x = this.frameIndex * config.frameWidth * scale
    const y = anim.row * config.frameHeight * scale
    this.onFrame(x, y)

    this.timer = setTimeout(() => {
      if (!this.current) return
      this.frameIndex++

      if (this.frameIndex >= anim.frames) {
        if (anim.loop) {
          this.frameIndex = 0
        } else {
          this.current = null
          this.onComplete?.()
          return
        }
      }

      this.tick()
    }, 1000 / anim.fps)
  }
}
