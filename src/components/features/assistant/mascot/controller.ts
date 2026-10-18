import { reducedMotionQuery } from '@/lib/reduced-motion'
import {
  type AnimationName,
  animations,
  type Frame,
  SIMBA_ANIMATIONS,
} from './constants'

export const pick = <T>(items: readonly [T, ...T[]]): T =>
  items[Math.floor(Math.random() * items.length)] ?? items[0]

const restCycles = () => 3 + Math.floor(Math.random() * 4)

export const REST: Frame = { duration: 0, pose: 'rest' }

export class SimbaController {
  private activity: AnimationName | null = null
  private current: { frames: Frame[]; index: number } | null = null
  private frame: Frame = REST
  private readonly listeners = new Set<() => void>()
  private motionQuery: MediaQueryList | undefined
  private queue: AnimationName[] = []
  private resting = false
  private rests = 0
  private restTarget = restCycles()
  private still = false
  private timer: ReturnType<typeof setTimeout> | undefined

  start() {
    this.motionQuery = reducedMotionQuery()
    this.motionQuery.addEventListener('change', this.onMotionChange)
    this.still = this.motionQuery.matches
    this.play(animations.show)
  }

  dispose() {
    clearTimeout(this.timer)
    this.motionQuery?.removeEventListener('change', this.onMotionChange)
    this.listeners.clear()
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  getFrame = () => this.frame

  play(name: AnimationName, { interrupt = false } = {}) {
    if (interrupt) {
      this.queue = [name]
      this.stopCurrent()
      return
    }
    this.queue.push(name)
    if (!this.current || this.resting) {
      this.stopCurrent()
    }
  }

  setActivity(name: AnimationName | null) {
    if (name === this.activity) {
      return
    }
    const previous = this.activity
    this.activity = name
    if (name) {
      this.play(name, { interrupt: true })
    } else if (previous) {
      this.stopCurrent()
    }
  }

  stop() {
    this.queue = []
    this.stopCurrent()
  }

  stopCurrent() {
    clearTimeout(this.timer)
    this.current = null
    this.next()
  }

  private readonly onMotionChange = (event: MediaQueryListEvent) => {
    this.still = event.matches
    if (this.still) {
      clearTimeout(this.timer)
      this.current = null
      this.show(REST)
      return
    }
    this.next()
  }

  private next() {
    if (this.still) {
      return
    }
    this.resting = false
    let name = this.queue.shift() ?? this.activity
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
    this.current = { frames: SIMBA_ANIMATIONS[name], index: 0 }
    this.tick()
  }

  private tick() {
    const current = this.current
    const frame = current?.frames[current.index]
    if (!(current && frame)) {
      this.next()
      return
    }
    this.show(frame)
    current.index++
    this.timer = setTimeout(() => this.tick(), frame.duration)
  }

  private show(frame: Frame) {
    this.frame = frame
    for (const listener of this.listeners) {
      listener()
    }
  }
}
