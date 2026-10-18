'use client'

import { useEffect, useEffectEvent } from 'react'
import { Icons } from '@/components/icons/icons'
import { success } from '@/lib/audio/minimal'
import { playSound } from '@/lib/audio/preferences'
import type { ConfettiIntensity } from '@/lib/confetti'
import { prefersReducedMotion } from '@/lib/reduced-motion'
import { toast } from '@/lib/toast'
import { isChatBusy, useChatContext } from '../chat-context'
import { ToolPendingLine } from './status-line'
import type { ToolPart } from './types'

// TODO(slopradar): duplication: the module-level handledCalls Set and its has/add guard are copied from tools/navigate.tsx (x2), move the run-once-per-toolCallId guard into one helper in tools/ that both parts call
const handledCalls = new Set<string>()

export function CelebratePart({ part }: { part: ToolPart<'celebrate'> }) {
  const { status } = useChatContext()
  const output = part.state === 'output-available' ? part.output : null
  const live = isChatBusy(status)

  const fire = useEffectEvent(async (intensity: ConfettiIntensity) => {
    if (handledCalls.has(part.toolCallId)) {
      return
    }
    handledCalls.add(part.toolCallId)

    if (prefersReducedMotion()) {
      toast.success('party time, woof!')
      return
    }
    playSound(success)
    const { launchConfetti } = await import('@/lib/confetti')
    launchConfetti(intensity)
  })

  useEffect(() => {
    if (output?.success && live) {
      // TODO(slopradar): unhandled-rejection: fire is async and nothing catches it, so a failed import('@/lib/confetti') (chunk load error) is an unhandled rejection and the visitor gets neither confetti nor the toast; catch it and fall back to toast.success
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

  return (
    // TODO(slopradar): duplication: this done line (p flex gap-2 text-sm plus a size-4 muted icon) is navigate.tsx's success line class for class, add a ToolDoneLine to status-line.tsx beside ToolPendingLine and use it in both
    <p className='flex items-center gap-2 text-sm'>
      <Icons.party
        aria-hidden
        className='size-4 shrink-0 text-muted-foreground'
      />
      <span>threw some confetti</span>
    </p>
  )
}
