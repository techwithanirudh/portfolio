'use client'

import { useAssistantContext } from './context'
import { useMascot } from './mascot'
import { useGutterSpot, useTriggerAway } from './mascot/presence'
import { MascotSprite } from './mascot/sprite'

export function AssistantTrigger() {
  const { expanded, open, setOpen } = useAssistantContext()
  const mascot = useMascot()
  const gutter = useGutterSpot({ expanded, open })
  const away = useTriggerAway({ expanded, open }) && !gutter

  if (!mascot) {
    return null
  }

  // Translate follows the panel's morph (300ms, its easing) while it's mounted
  return (
    <button
      aria-expanded={open}
      aria-hidden={gutter || undefined}
      aria-label='Ask Simba'
      className='fixed right-[calc(max(1rem,env(safe-area-inset-right))-0.5rem)] bottom-[max(1rem,env(safe-area-inset-bottom))] z-45 origin-bottom rounded-md outline-none transition-[translate,scale,opacity] duration-200 ease-out-strong hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring active:scale-96 data-away:pointer-events-none data-away:translate-y-6 data-gutter:translate-y-[calc(max(1rem,env(safe-area-inset-bottom))-var(--simba-band)+3px)] data-away:opacity-0 data-gutter:active:scale-100 data-gutter:hover:scale-100 print:hidden min-[1000px]:[:root:has([data-simba-panel])_&]:z-51 min-[1000px]:[:root:has([data-simba-panel])_&]:[transition:translate_300ms_cubic-bezier(0.2,0,0,1),scale_200ms_var(--ease-out-strong),opacity_200ms_var(--ease-out-strong)]'
      data-away={away || undefined}
      data-gutter={gutter || undefined}
      data-native-cursor
      data-simba-trigger
      inert={away}
      onClick={() => setOpen(!open)}
      // Keeps focus where it is in the panel and its focus trap
      onMouseDown={open ? (event) => event.preventDefault() : undefined}
      tabIndex={gutter ? -1 : undefined}
      type='button'
    >
      <MascotSprite mascot={mascot} size={88} />
    </button>
  )
}
