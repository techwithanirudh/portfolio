'use client'

import { CLICKS_TO_ENABLE, useOiiaMode } from '@/components/oiia'
import { tap } from '@/lib/audio/minimal'
import { playSound } from '@/lib/audio/preferences'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'

export function HeroName() {
  const { mode, registerClick } = useOiiaMode()
  const isOiia = mode === 'oiia'

  return (
    <button
      aria-describedby='oiia-hint'
      aria-pressed={isOiia}
      className={cn(
        'inline-flex items-baseline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isOiia && 'text-primary'
      )}
      onClick={() => {
        const result = registerClick()
        // Each click lands a semitone higher, like winding something up
        playSound(tap, {
          detune: (CLICKS_TO_ENABLE - result.remaining) * 100,
        })
        if (result.remaining > 0) {
          const clicksDone = CLICKS_TO_ENABLE - result.remaining
          if (clicksDone > 3) {
            const clicks = result.remaining === 1 ? 'click' : 'clicks'
            toast(`${result.remaining} ${clicks} remaining`)
          }
        } else if (result.mode === 'oiia') {
          toast('oiia mode enabled, collide two cats to spawn more')
        } else {
          toast('oiia mode disabled')
        }
      }}
      type='button'
    >
      {/* The heading keeps its real name for screen readers in OIIA mode */}
      {isOiia ? (
        <>
          <span aria-hidden>OIIA</span>
          <span className='sr-only'>Anirudh Sriram</span>
        </>
      ) : (
        'Anirudh Sriram'
      )}
    </button>
  )
}

// Lives outside the h1 so the heading's name stays just the name
export const HeroNameHint = () => (
  <span className='sr-only' id='oiia-hint'>
    Press repeatedly to toggle OIIA mode, a hidden easter egg.
  </span>
)
