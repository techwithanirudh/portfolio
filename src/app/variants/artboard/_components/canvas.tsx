'use client'

import type { ReactNode } from 'react'
import { useWorkspace } from './workspace'

/** The scrolling canvas. Clicking empty canvas clears the selection. */
export function Canvas({ children }: { children: ReactNode }) {
  const { clear } = useWorkspace()
  return (
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: empty-canvas click is a pointer nicety; Esc does the same from the keyboard
    // biome-ignore lint/a11y/useKeyWithClickEvents: Esc deselects from the keyboard
    <main
      className='ab-canvas px-4 pt-6 pb-36 md:px-8 md:pt-10 lg:px-10 xl:px-12'
      id='canvas'
      onClick={(event) => {
        const target = event.target as HTMLElement
        if (!target.closest('.ab-frame, .ab-label, a, button')) {
          clear()
        }
      }}
    >
      <div className='mx-auto w-full max-w-[880px]'>{children}</div>
    </main>
  )
}
