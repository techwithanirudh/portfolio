'use client'

import { Icons } from '@/components/icons/icons'
import { toggleOff, toggleOn } from '@/lib/audio/mechanical'
import {
  playSound,
  setSoundEnabled,
  useSoundEnabled,
} from '@/lib/audio/preferences'

export function SoundToggle() {
  const enabled = useSoundEnabled()
  const Icon = enabled ? Icons.volumeOn : Icons.volumeOff

  return (
    <button
      aria-pressed={enabled}
      className='inline-flex h-7 items-center gap-1.5 px-2 font-mono text-muted-foreground text-xs transition-colors hover:text-foreground'
      data-sound='off'
      onClick={() => {
        if (enabled) {
          // Last sound before going quiet
          playSound(toggleOff)
          setSoundEnabled(false)
        } else {
          setSoundEnabled(true)
          playSound(toggleOn)
        }
      }}
      type='button'
    >
      <Icon className='size-3.5' />
      sound {enabled ? 'on' : 'off'}
    </button>
  )
}
