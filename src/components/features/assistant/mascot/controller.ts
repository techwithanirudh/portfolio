import { reducedMotionQuery } from '@/lib/reduced-motion'
import {
  type AnimationName,
  animations,
  type Frame,
  SIMBA_ANIMATIONS,
} from './constants'

export const pick = <T>(items: readonly [T, ...T[]]): T =>
  items[Math.floor(Math.random() * items.length)] ?? items[0]

/** Idle cycles (2.6 s each) before a big idle animation: 5 to 9, about every 13 to 23 s */
const restCycles = () => 5 + Math.floor(Math.random() * 5)

export const REST: Frame = { duration: 0, pose: 'rest' }
const HIDDEN: Frame = { duration: 0, pose: 'hidden' }
const SLEEP: Frame = { duration: 0, pose: 'sleeping' }

export class SimbaController {
  private activity: AnimationName | null = null
  private away = false
  private current: { frames: Frame[]; index: number } | null = null
  private drowsy = false
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
    this.drowsy = false
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
      this.restartRests()
      this.stopCurrent()
    }
  }

  /** Falls asleep once he finishes what he's doing, unless he has an activity */
  nap() {
    if (this.drowsy || this.activity) {
      return
    }
    this.drowsy = true
    if (!this.current || this.resting) {
      this.stopCurrent()
    }
  }

  wake() {
    if (!this.drowsy) {
      return
    }
    this.drowsy = false
    if (this.frame === SLEEP) {
      this.restartRests()
      this.stopCurrent()
    }
  }

  /** Hides while his spot is gone; comes back with Show or whatever was queued meanwhile */
  setAway(away: boolean) {
    if (away === this.away) {
      return
    }
    this.away = away
    if (away) {
      this.queue = []
    } else if (this.queue.length === 0) {
      this.queue = [animations.show]
    }
    this.stopCurrent()
  }

  /** Drops what he's doing, his activity too, and settles on rest */
  settle() {
    this.activity = null
    this.queue = this.away ? [] : [animations.settle]
    this.restartRests()
    this.stopCurrent()
  }

  private restartRests() {
    this.rests = 0
    this.restTarget = restCycles()
  }

  stopCurrent() {
    clearTimeout(this.timer)
    this.current = null
    this.next()
  }

  private readonly onMotionChange = (event: MediaQueryListEvent) => {
    this.still = event.matches
    clearTimeout(this.timer)
    this.next()
  }

  private next() {
    if (this.away) {
      this.current = null
      this.show(HIDDEN)
      return
    }
    if (this.still) {
      this.current = null
      this.queue = []
      const idle = this.drowsy ? SLEEP : REST
      this.show((this.activity && SIMBA_ANIMATIONS[this.activity][0]) || idle)
      return
    }
    this.resting = false
    let name = this.queue.shift() ?? this.activity
    if (
      !name &&
      this.drowsy &&
      (this.frame === SLEEP || this.frame.pose === 'rest')
    ) {
      this.current = null
      this.show(SLEEP)
      return
    }
    if (!name) {
      if (this.rests >= this.restTarget && !this.drowsy) {
        this.restartRests()
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
