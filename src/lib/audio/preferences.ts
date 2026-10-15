import {
  defineSound,
  ensureReady,
  type PlayOptions,
  type SoundDefinition,
} from '@web-kits/audio'
import { useSyncExternalStore } from 'react'
import { toggleOff, toggleOn } from '@/lib/audio/minimal'
import { prefersReducedMotion } from '@/lib/reduced-motion'

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

// Audio stays locked until the first click, tap or key press. Earlier sounds
// are dropped, not queued, so unlocking doesn't fire a burst of old hovers
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
  return () => listeners.delete(listener)
}

export const setSoundEnabled = (next: boolean) => {
  hydrate()
  enabled = next
  try {
    window.localStorage.setItem(STORAGE_KEY, String(next))
  } catch {
    // Storage can be blocked, the preference then lasts this visit only
  }
  for (const listener of listeners) {
    listener()
  }
}

const getSoundEnabled = () => {
  hydrate()
  return enabled
}

// The server snapshot is on so the first client render matches the markup
export const useSoundEnabled = () =>
  useSyncExternalStore(subscribe, getSoundEnabled, () => true)

// For code outside React that can't use useSound
export const playSound = (definition: SoundDefinition, opts?: PlayOptions) => {
  if (!(unlocked && getSoundEnabled()) || prefersReducedMotion()) {
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

// The off cue plays first and the on cue after, so each one is audible
export const toggleSound = () => {
  if (getSoundEnabled()) {
    playSound(toggleOff)
    setSoundEnabled(false)
  } else {
    setSoundEnabled(true)
    playSound(toggleOn)
  }
}
