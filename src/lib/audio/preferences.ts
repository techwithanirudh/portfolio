import {
  defineSound,
  ensureReady,
  type PlayOptions,
  type SoundDefinition,
} from '@web-kits/audio'
import { useSyncExternalStore } from 'react'
import { toggleOff, toggleOn } from '@/lib/audio/minimal'
import { prefersReducedMotion, reducedMotionQuery } from '@/lib/reduced-motion'

const STORAGE_KEY = 'sound-enabled'
const UNLOCK_EVENTS = ['pointerdown', 'keydown', 'touchend'] as const
const listeners = new Set<() => void>()
const players = new WeakMap<SoundDefinition, (opts?: PlayOptions) => unknown>()

const read = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== 'false'
  } catch {
    return true
  }
}

let enabled = true
let hydrated = false

const notify = () => {
  for (const listener of listeners) {
    listener()
  }
}

let unlocked = false
if (typeof window !== 'undefined') {
  const unlock = () => {
    unlocked = true
    ensureReady().catch(() => {
      // Another gesture will try again
    })
    for (const type of UNLOCK_EVENTS) {
      window.removeEventListener(type, unlock, true)
    }
    notify()
  }
  for (const type of UNLOCK_EVENTS) {
    window.addEventListener(type, unlock, { capture: true, passive: true })
  }
}

const hydrate = () => {
  if (!hydrated && typeof window !== 'undefined') {
    hydrated = true
    enabled = read()
  }
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  const motion = reducedMotionQuery()
  motion.addEventListener('change', listener)
  return () => {
    listeners.delete(listener)
    motion.removeEventListener('change', listener)
  }
}

const setSoundEnabled = (next: boolean) => {
  hydrate()
  enabled = next
  try {
    window.localStorage.setItem(STORAGE_KEY, String(next))
  } catch {
    // Storage can be blocked, the preference then lasts this visit only
  }
  notify()
}

const getSoundEnabled = () => {
  hydrate()
  return enabled
}

const canPlaySound = () =>
  unlocked && getSoundEnabled() && !prefersReducedMotion()

export const useSoundEnabled = () =>
  useSyncExternalStore(subscribe, getSoundEnabled, () => true)

export const useCanPlaySound = () =>
  useSyncExternalStore(subscribe, canPlaySound, () => false)

export const playSound = (definition: SoundDefinition, opts?: PlayOptions) => {
  if (!canPlaySound()) {
    return
  }
  let play = players.get(definition)
  if (!play) {
    play = defineSound(definition)
    players.set(definition, play)
  }
  const run = play
  ensureReady()
    .then(() => run(opts))
    .catch(() => {
      // Browsers reject audio until a trusted user gesture
    })
}

export const toggleSound = () => {
  if (getSoundEnabled()) {
    playSound(toggleOff)
    setSoundEnabled(false)
  } else {
    setSoundEnabled(true)
    playSound(toggleOn)
  }
}
