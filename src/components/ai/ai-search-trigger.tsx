'use client'

import dynamic from 'next/dynamic'
import { useAISearchContext } from '@/components/ai/chat'
import { useClippy } from '@/components/clippy'
import { useClippyTrigger } from '@/components/clippy/hooks'

function ClippyTriggerInner() {
  const { setOpen } = useAISearchContext()
  const { agent } = useClippy()
  useClippyTrigger({ agent, setOpen })

  return null
}

export const AISearchTrigger = dynamic(
  () => Promise.resolve(ClippyTriggerInner),
  { ssr: false }
)
