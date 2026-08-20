'use client'

import { useOiiaMode } from '@/components/oiia'
import { toast } from '@/lib/toast'

export function HeroName() {
  const { mode, registerClick } = useOiiaMode()
  const isOiia = mode === 'oiia'

  if (isOiia) {
    return (
      <>
        Hi! I'm{' '}
        <button
          aria-pressed={isOiia}
          className='inline-flex items-baseline rounded-sm px-1 text-primary transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          onClick={() => {
            registerClick()
          }}
          type='button'
        >
          OIIA
        </button>
        !
      </>
    )
  }

  return (
    <>
      Hi! I'm{' '}
      <button
        aria-pressed={isOiia}
        className='inline-flex items-baseline rounded-sm px-1 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        onClick={() => {
          const result = registerClick()
          if (result.remaining > 0) {
            const clicks = result.remaining === 1 ? 'click' : 'clicks'
            toast(`${result.remaining} ${clicks} remaining`)
          } else if (result.mode === 'oiia') {
            toast('oiia mode enabled')
          } else {
            toast('oiia mode disabled')
          }
        }}
        type='button'
      >
        Anirudh
      </button>
      !
    </>
  )
}
