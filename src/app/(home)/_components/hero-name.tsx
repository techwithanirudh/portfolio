'use client'

import { CLICKS_TO_ENABLE, useOiiaMode } from '@/components/oiia'
import { tap } from '@/lib/audio/mechanical'
import { playSound } from '@/lib/audio/preferences'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'

export function HeroName() {
  const { mode, registerClick } = useOiiaMode()
  const isOiia = mode === 'oiia'

  return (
    <>
      <button
        aria-describedby='oiia-hint'
        aria-pressed={isOiia}
        className={cn(
          'inline-flex items-baseline rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
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
        {isOiia ? 'OIIA' : 'an1rudh'}
      </button>
      <span
        aria-hidden
        className='caret ml-1 inline-block h-[0.85em] w-[0.5ch] translate-y-[0.08em] bg-primary'
      />
      <span className='sr-only' id='oiia-hint'>
        Press repeatedly to toggle OIIA mode, a hidden easter egg.
      </span>
    </>
  )
}
