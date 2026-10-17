'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useOn } from '@/hooks/use-on'
import { useAssistantContext } from './context'
import { useMascot } from './mascot'
import { usePageSimba, usePeeking } from './mascot/presence'
import { SimbaRig } from './mascot/rig'
import { MascotSprite } from './mascot/sprite'

// How long a woken Simba stays up in dark mode before he naps again
const NAP_AFTER_MS = 20_000

// Simba sits in the corner below the panel. The drawing has room on its
// right for wider poses, so the button tucks half a rem past the panel's inset
// to line his shadow up with the panel's edge.
//
// In dark mode he naps until the pointer or a click wakes him, then drifts
// off again after a quiet spell. He steps away while he peeks over the footer
// or a page shows its own Simba
export function AssistantTrigger() {
  const { open, setOpen } = useAssistantContext()
  const mascot = useMascot()
  const peeking = usePeeking()
  const pageSimba = usePageSimba()
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme === 'dark'
  const [awake, setAwake] = useState(false)
  const [hovered, setHovered] = useState(false)

  // Switching to dark mode sends him straight back to sleep
  useOn(dark, () => setAwake(false))

  useEffect(() => {
    if (!(dark && awake) || open || hovered) {
      return
    }
    const timer = setTimeout(() => setAwake(false), NAP_AFTER_MS)
    return () => clearTimeout(timer)
  }, [awake, dark, hovered, open])

  if (!mascot) {
    return null
  }

  const napping = dark && !awake && !open
  const away = (peeking || pageSimba) && !open

  const wake = () => {
    if (napping) {
      setAwake(true)
      mascot.play('ClickedOn', { interrupt: true })
    }
  }

  return (
    <button
      aria-expanded={open}
      aria-label={open ? 'Close Simba' : 'Ask Simba'}
      className='fixed right-[calc(max(1rem,env(safe-area-inset-right))-0.5rem)] bottom-[max(1rem,env(safe-area-inset-bottom))] z-45 origin-bottom rounded-md outline-none transition-[translate,scale,opacity] duration-200 ease-out-strong hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring active:scale-95 data-away:pointer-events-none data-away:translate-y-6 data-away:opacity-0 motion-reduce:transition-none print:hidden'
      data-away={away || undefined}
      data-native-cursor
      inert={away}
      onClick={() => {
        setAwake(true)
        setOpen((prev) => !prev)
      }}
      onFocus={wake}
      onPointerEnter={() => {
        setHovered(true)
        wake()
      }}
      onPointerLeave={() => setHovered(false)}
      type='button'
    >
      {napping ? (
        <>
          <SimbaRig pose='searching' size={88} />
          <span
            aria-hidden
            className='simba-zzz pointer-events-none absolute top-1 left-2 font-hand text-primary leading-none'
          >
            z <span className='text-[1.2em]'>z</span>{' '}
            <span className='text-[1.4em]'>z</span>
          </span>
        </>
      ) : (
        <MascotSprite mascot={mascot} size={88} />
      )}
    </button>
  )
}
