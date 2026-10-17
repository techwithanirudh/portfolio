'use client'

import { useAssistantContext } from './context'
import { useMascot } from './mascot'
import { usePageSimba } from './mascot/presence'
import { MascotSprite } from './mascot/sprite'

// Simba sits in the corner below the panel. The drawing has room on its
// right for wider poses, so the button tucks half a rem past the panel's inset
// to line his shadow up with the panel's edge. He steps away while a page
// shows its own Simba
export function AssistantTrigger() {
  const { open, setOpen } = useAssistantContext()
  const mascot = useMascot()
  const pageSimba = usePageSimba()

  if (!mascot) {
    return null
  }

  const away = pageSimba && !open

  return (
    <button
      aria-expanded={open}
      aria-label={open ? 'Close Simba' : 'Ask Simba'}
      className='fixed right-[calc(max(1rem,env(safe-area-inset-right))-0.5rem)] bottom-[max(1rem,env(safe-area-inset-bottom))] z-45 origin-bottom rounded-md outline-none transition-[translate,scale,opacity] duration-200 ease-out-strong hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.96] data-away:pointer-events-none data-away:translate-y-6 data-away:opacity-0 motion-reduce:transition-none print:hidden'
      data-away={away || undefined}
      data-native-cursor
      inert={away}
      onClick={() => setOpen((prev) => !prev)}
      type='button'
    >
      <MascotSprite mascot={mascot} size={88} />
    </button>
  )
}
