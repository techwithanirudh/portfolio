'use client'

import type { UseChatHelpers } from '@ai-sdk/react'
import { isToolUIPart } from 'ai'
import { useEffect, useRef } from 'react'
import type { MyUIMessage } from '@/app/api/chat/types'
import type {
  MascotAvatarName,
  MascotMood,
} from '@/app/api/chat/utils/tools/animate-mascot'
import { useOn } from '@/hooks/use-on'
import { animations, moodAnimations } from './constants'
import type { MascotAgent } from './provider'
import { playAnimation } from './utils'

export const playSubmitAnimation = (agent: MascotAgent | undefined) => {
  if (!agent) {
    return
  }
  playAnimation(agent, animations.submit, { interrupt: true })
}

export function useMascotPanel({
  agent,
  messages,
  open,
  status,
}: {
  agent: MascotAgent | undefined
  messages: MyUIMessage[]
  open: boolean
  status: UseChatHelpers<MyUIMessage>['status']
}) {
  const lastTool = useRef<string | null>(null)

  useOn(open, () => {
    if (!agent) {
      return
    }
    agent.stop()
    if (open) {
      playAnimation(agent, animations.open)
      return
    }
    agent.play(animations.bye)
    agent.play(animations.show)
  })

  useOn(status, () => {
    if (!agent) {
      return
    }
    if (status === 'streaming') {
      agent.stopCurrent()
    }
    if (status === 'ready') {
      lastTool.current = null
    }
  })

  useOn(messages, () => {
    if (!agent || status !== 'streaming') {
      return
    }
    const toolPart = (messages.at(-1)?.parts ?? []).find(isToolUIPart)
    if (!toolPart || lastTool.current === toolPart.type) {
      return
    }
    lastTool.current = toolPart.type
    playAnimation(agent, animations.tool, { interrupt: true })
  })
}

/** Applies `animateMascot` tool calls from the chat: swaps avatar and/or plays a mood. */
export function useMascotTool({
  agent,
  avatar,
  messages,
  setAvatar,
}: {
  agent: MascotAgent | undefined
  avatar: MascotAvatarName
  messages: MyUIMessage[]
  setAvatar: (avatar: MascotAvatarName) => void
}) {
  const handled = useRef(new Set<string>())
  // A swapped avatar loads asynchronously, so its mood waits for the new agent.
  const pendingMood = useRef<MascotMood | null>(null)

  useOn(messages, () => {
    for (const part of messages.flatMap((message) => message.parts)) {
      if (
        part.type !== 'tool-animateMascot' ||
        part.state !== 'output-available' ||
        handled.current.has(part.toolCallId)
      ) {
        continue
      }
      handled.current.add(part.toolCallId)

      const { animation, avatar: nextAvatar } = part.output
      if (nextAvatar && nextAvatar !== avatar) {
        pendingMood.current = animation ?? null
        setAvatar(nextAvatar)
      } else if (animation && agent) {
        playAnimation(agent, moodAnimations[avatar][animation], {
          interrupt: true,
        })
      }
    }
  })

  useEffect(() => {
    if (!(agent && pendingMood.current)) {
      return
    }
    playAnimation(agent, moodAnimations[avatar][pendingMood.current])
    pendingMood.current = null
  }, [agent, avatar])
}
