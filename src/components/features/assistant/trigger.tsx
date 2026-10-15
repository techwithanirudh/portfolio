'use client'

import { useAssistantContext } from '@/components/features/assistant/assistant'
import { useMascot } from '@/components/features/assistant/mascot'
import { MascotSprite } from '@/components/features/assistant/mascot/sprite'

// Matches the panel's right-4 inset so Simba lines up with it
const EDGE_OFFSET = 16

// Hidden below lg by [data-mascot] in globals.css
export function AssistantTrigger() {
  const { open, setOpen } = useAssistantContext()
  const mascot = useMascot()

  if (!mascot) {
    return null
  }

  return (
    <button
      aria-expanded={open}
      aria-label={open ? 'Close the assistant' : 'Ask Simba'}
      className='fixed z-45 origin-bottom transition-transform duration-300 ease-out hover:scale-110 active:scale-95'
      data-mascot
      data-sound-hover
      onClick={() => setOpen((prev) => !prev)}
      style={{ bottom: EDGE_OFFSET, right: EDGE_OFFSET }}
      type='button'
    >
      <MascotSprite mascot={mascot} />
    </button>
  )
}
