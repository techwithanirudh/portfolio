'use client'

import dynamic from 'next/dynamic'
import { type KeyboardEvent, useCallback } from 'react'
import { useAISearchContext } from '@/components/ai/chat'
import { useSimba } from '@/components/simba'
import { cn } from '@/lib/utils'

function SimbaTriggerInner() {
  const { open, setOpen } = useAISearchContext()
  const { attachSprite, isReady } = useSimba()

  const handleClick = useCallback(() => {
    setOpen((prev) => !prev)
  }, [setOpen])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    },
    [setOpen]
  )

  return (
    <div
      ref={attachSprite}
      aria-label={open ? 'Close Simba' : 'Ask Simba'}
      aria-pressed={open}
      className={cn(
        'fixed bottom-5 right-5 z-40 size-20 cursor-pointer bg-no-repeat transition-opacity duration-300',
        isReady ? 'opacity-100' : 'opacity-0'
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role='button'
      style={{
        backgroundImage: 'url(/agents/Rover.png)',
        backgroundPosition: '0 0',
        imageRendering: 'pixelated',
      }}
      tabIndex={0}
    />
  )
}

export const AISearchTrigger = dynamic(
  () => Promise.resolve(SimbaTriggerInner),
  { ssr: false }
)
