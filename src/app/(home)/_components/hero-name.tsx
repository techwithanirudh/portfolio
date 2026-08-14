'use client'

import { useOiiaMode } from '@/components/oiia'
import { toast } from '@/lib/toast'

export function HeroName() {
  const { mode, registerOiiaClick } = useOiiaMode()
  const isOiia = mode === 'oiia'

  if (isOiia) {
    return (
      <>
        Hi! I'm{' '}
        <button
          aria-pressed={isOiia}
          className='inline-flex items-baseline rounded-sm px-1 text-primary transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          onClick={() => {
            registerOiiaClick()
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
          const result = registerOiiaClick()
          if (result.remaining > 0) {
            toast(`${result.remaining} clicks remaining`)
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
