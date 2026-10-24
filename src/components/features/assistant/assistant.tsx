'use client'

import { useChat } from '@ai-sdk/react'
import { useSound } from '@web-kits/audio/react'
import { DefaultChatTransport } from 'ai'
import { useIsMobile } from '@/hooks/use-mobile'
import type { ChatUIMessage } from '@/lib/ai/chat/types'
import { deleteSound, error as errorSound, success } from '@/lib/audio/minimal'
import { ChatContext } from './chat-context'
import { MascotProvider } from './mascot'
import { AssistantPanel } from './panel'
import { AssistantTrigger } from './trigger'

const transport = new DefaultChatTransport<ChatUIMessage>({ api: '/api/chat' })

export function Assistant() {
  const isMobile = useIsMobile()
  const playError = useSound(errorSound)
  const playSuccess = useSound(success)
  const playDelete = useSound(deleteSound)
  const chat = useChat<ChatUIMessage>({
    id: 'simba',
    onError: () => playError(),
    onFinish: ({ isAbort, isDisconnect, isError }) => {
      if (isAbort) {
        playDelete()
        return
      }
      if (!(isDisconnect || isError)) {
        playSuccess()
      }
    },
    transport,
  })

  return (
    <MascotProvider disabled={isMobile}>
      <ChatContext value={chat}>
        <AssistantPanel />
        <AssistantTrigger />
      </ChatContext>
    </MascotProvider>
  )
}
