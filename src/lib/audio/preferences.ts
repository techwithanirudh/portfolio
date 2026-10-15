import {
  defineSound,
  ensureReady,
  type PlayOptions,
  type SoundDefinition,
} from '@web-kits/audio'
import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'sound-enabled'
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
    // Storage can be blocked, the preference then lasts for this visit only.
  }
  for (const listener of listeners) {
    listener()
  }
}

export const getSoundEnabled = () => {
  hydrate()
  return enabled
}

// Sounds stay on until the visitor mutes them. The server snapshot is "on" so
// the first client render matches the markup.
export const useSoundEnabled = () =>
  useSyncExternalStore(subscribe, getSoundEnabled, () => true)

// For code outside React (toasts, physics, global listeners) that cannot use
// useSound. It honors the same mute switch and reduced motion setting.
export const playSound = (definition: SoundDefinition, opts?: PlayOptions) => {
  if (
    !getSoundEnabled() ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
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
      // Browsers can reject audio until a trusted user gesture has occurred.
    })
}
