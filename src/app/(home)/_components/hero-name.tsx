'use client'

import { useOiiaMode } from '@/components/oiia'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'

export function HeroName() {
  const { mode, registerClick } = useOiiaMode()
  const isOiia = mode === 'oiia'

  return (
    <>
      Hi! I'm{' '}
      <button
        aria-pressed={isOiia}
        className={cn(
          'inline-flex items-baseline rounded-sm px-1 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isOiia && 'text-primary'
        )}
        onClick={() => {
          const result = registerClick()
          if (result.remaining > 0) {
            const clicks = result.remaining === 1 ? 'click' : 'clicks'
            toast(`${result.remaining} ${clicks} remaining`)
          } else if (result.mode === 'oiia') {
            toast('oiia mode enabled — collide two cats to spawn more')
          } else {
            toast('oiia mode disabled')
          }
        }}
        type='button'
      >
        {isOiia ? 'OIIA' : 'Anirudh'}
      </button>
      !
    </>
  )
}
