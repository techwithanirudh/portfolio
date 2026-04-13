type Branch = { frameIndex: number; weight: number }

export type AnimationFrame = {
  duration: number
  images: [[number, number], ...[number, number][]]
  branching?: { branches: Branch[] }
}

export type Animation = {
  frames: AnimationFrame[]
}

/**
 * Drives a sprite-sheet animation by calling `onFrame(x, y)` once per frame.
 * Uses the same weighted-random branching logic as the original MS Agent format.
 */
export class FloppyEngine {
  private timer: ReturnType<typeof setTimeout> | null = null
  private frameIndex = 0
  private animation: Animation | null = null
  private readonly onFrame: (x: number, y: number) => void

  constructor(onFrame: (x: number, y: number) => void) {
    this.onFrame = onFrame
  }

  play(animation: Animation): void {
    this.stop()
    this.animation = animation
    this.frameIndex = 0
    this.tick()
  }

  stop(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer)
      this.timer = null
    }
    this.animation = null
  }

  private tick(): void {
    const anim = this.animation
    if (!anim) return

    const frame = anim.frames[this.frameIndex]
    if (!frame) {
      this.animation = null
      return
    }

    const [x, y] = frame.images[0]
    this.onFrame(x, y)

    this.timer = setTimeout(() => {
      if (!this.animation) return
      this.frameIndex = this.resolveNext(frame, this.frameIndex, anim.frames.length)
      if (this.frameIndex >= anim.frames.length) {
        this.animation = null
        return
      }
      this.tick()
    }, frame.duration)
  }

  /**
   * Mirrors the original clippyts branching: subtract each branch weight from a
   * 0-100 roll; first branch whose cumulative weight exceeds the roll wins.
   * If no branch is taken, fall through to the next sequential frame.
   */
  private resolveNext(frame: AnimationFrame, current: number, total: number): number {
    const branches = frame.branching?.branches
    if (!branches || branches.length === 0) return current + 1

    let rnd = Math.random() * 100
    for (const branch of branches) {
      if (rnd <= branch.weight) return branch.frameIndex
      rnd -= branch.weight
    }

    const next = current + 1
    return next < total ? next : total
  }
}
