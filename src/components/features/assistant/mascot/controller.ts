import { prefersReducedMotion } from '@/lib/reduced-motion'
import { type AnimationName, animations, type Frame, SIMBA } from './constants'

const pick = <T>(items: readonly T[]) =>
  items[Math.floor(Math.random() * items.length)] as T

// Rest loops this many times before Simba does something on his own
const restCycles = () => 3 + Math.floor(Math.random() * 4)

// Plays Simba's sprite animations from a queue. Between queued animations
// he rests, and every few rests he picks an idle trick. Reduced motion
// keeps him on his first frame.
export class SimbaController {
  private frame: Frame = SIMBA.animations[animations.rest].frames[0] ?? {
    duration: 0,
    x: 0,
    y: 0,
  }
  private current: { frames: Frame[]; index: number } | null = null
  private readonly listeners = new Set<() => void>()
  private queue: AnimationName[] = []
  private resting = false
  private rests = 0
  private restTarget = restCycles()
  private still = false
  private timer: ReturnType<typeof setTimeout> | undefined

  start() {
    this.still = prefersReducedMotion()
    this.next()
  }

  dispose() {
    clearTimeout(this.timer)
    this.listeners.clear()
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  getFrame = () => this.frame

  hasAnimation(name: string): name is AnimationName {
    return name in SIMBA.animations
  }

  /** Queue an animation, or cut in and play it now with `interrupt` */
  play(name: AnimationName, { interrupt = false } = {}) {
    if (interrupt) {
      this.queue = [name]
      this.stopCurrent()
      return
    }
    this.queue.push(name)
    // Resting counts as idle, so a queued animation starts right away
    if (!this.current || this.resting) {
      this.stopCurrent()
    }
  }

  /** Drop everything queued and go back to resting */
  stop() {
    this.queue = []
    this.stopCurrent()
  }

  /** Skip the rest of the animation that is playing */
  stopCurrent() {
    clearTimeout(this.timer)
    this.current = null
    this.next()
  }

  private next() {
    if (this.still) {
      return
    }
    let name = this.queue.shift()
    this.resting = false
    if (!name) {
      if (this.rests >= this.restTarget) {
        this.rests = 0
        this.restTarget = restCycles()
        name = pick(animations.idle)
      } else {
        this.rests++
        this.resting = true
        name = animations.rest
      }
    }
    this.current = { frames: SIMBA.animations[name].frames, index: 0 }
    this.tick()
  }

  private tick() {
    const current = this.current
    const frame = current?.frames[current.index]
    if (!(current && frame)) {
      this.next()
      return
    }
    this.frame = frame
    for (const listener of this.listeners) {
      listener()
    }
    current.index++
    this.timer = setTimeout(() => this.tick(), frame.duration)
  }
}
