'use client'

import dynamic from 'next/dynamic'
import { useAISearchContext } from '@/components/ai/chat'
import { useClippy } from '@/components/clippy'
import { useClippyTriggerBehavior } from '@/components/clippy/use-clippy-behavior'

function ClippyTriggerInner() {
  const { open, setOpen } = useAISearchContext()
  const { agent } = useClippy()
  useClippyTriggerBehavior({ agent, open, setOpen })

  return null
}

export const AISearchTrigger = dynamic(
  () => Promise.resolve(ClippyTriggerInner),
  { ssr: false }
)
