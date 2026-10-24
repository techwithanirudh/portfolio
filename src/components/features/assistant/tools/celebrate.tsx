'use client'

import { useEffect, useEffectEvent } from 'react'
import { Icons } from '@/components/icons/icons'
import { success } from '@/lib/audio/minimal'
import { playSound } from '@/lib/audio/preferences'
import { type ConfettiIntensity, launchConfetti } from '@/lib/confetti'
import { prefersReducedMotion } from '@/lib/reduced-motion'
import { toast } from '@/lib/toast'
import { isChatBusy, useChatContext } from '../chat-context'
import { claimToolCall } from './run-once'
import { ToolDoneLine, ToolPendingLine } from './status-line'
import type { ToolPart } from './types'

export function CelebratePart({ part }: { part: ToolPart<'celebrate'> }) {
  const { status } = useChatContext()
  const output = part.state === 'output-available' ? part.output : null
  const live = isChatBusy(status)

  const fire = useEffectEvent((intensity: ConfettiIntensity) => {
    if (!claimToolCall(part.toolCallId)) {
      return
    }

    if (prefersReducedMotion()) {
      toast.success('party time, woof!')
      return
    }
    playSound(success)
    launchConfetti(intensity)
  })

  useEffect(() => {
    if (output && live) {
      fire(output.intensity)
    }
  }, [output, live])

  if (!output) {
    return (
      <ToolPendingLine icon={Icons.party}>
        getting the confetti…
      </ToolPendingLine>
    )
  }

  return <ToolDoneLine icon={Icons.party}>threw some confetti</ToolDoneLine>
}
