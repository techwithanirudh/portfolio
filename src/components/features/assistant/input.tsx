'use client'

import { useSound } from '@web-kits/audio/react'
import { getStaticToolName, isStaticToolUIPart } from 'ai'
import { useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
} from '@/components/ai-elements/prompt-input'
import { Icons } from '@/components/icons/icons'
import { toolConfirmationMap } from '@/lib/ai/chat/confirmation'
import type { ChatTools } from '@/lib/ai/chat/types'
import { send } from '@/lib/audio/minimal'
import { MEDIA } from '@/lib/media'
import { cn } from '@/lib/utils'
import { isChatBusy, useChatContext } from './chat-context'
import { useAssistantContext } from './context'
import { useMascot } from './mascot'
import { animations } from './mascot/constants'

const assistantInputStorageKey = 'simba:draft'

// Storage access throws when site data is blocked (Safari "Block all cookies")
const readSavedInput = () => {
  try {
    return localStorage.getItem(assistantInputStorageKey) ?? ''
  } catch {
    return ''
  }
}

const writeSavedInput = (value: string | null) => {
  try {
    if (value === null) {
      localStorage.removeItem(assistantInputStorageKey)
    } else {
      localStorage.setItem(assistantInputStorageKey, value)
    }
  } catch {
    // Without storage the draft just isn't kept
  }
}

export function useAskSimba() {
  const { sendMessage } = useChatContext()
  const mascot = useMascot()
  const playSend = useSound(send)

  return (text: string, context?: string) => {
    mascot?.setActivity(animations.submit)
    playSend()

    return sendMessage({
      parts: [
        {
          data: {
            location: window.location.href,
          },
          type: 'data-client',
        },
        {
          text,
          type: 'text',
        },
        ...(context
          ? [
              {
                data: {
                  text: context,
                },
                type: 'data-context' as const,
              },
            ]
          : []),
      ],
    })
  }
}

export function AssistantInput() {
  const { setContext, context } = useAssistantContext()
  const { status, stop, messages } = useChatContext()
  const ask = useAskSimba()
  const finePointer = useMediaQuery(MEDIA.finePointer)
  const [input, setInput] = useState(readSavedInput)
  const hasPendingToolInput = messages.some((message) =>
    message.parts.some(
      (part) =>
        isStaticToolUIPart<ChatTools>(part) &&
        part.state === 'input-available' &&
        toolConfirmationMap[getStaticToolName<ChatTools>(part)]
    )
  )
  const isStreaming = isChatBusy(status)
  const isLoading = isStreaming || hasPendingToolInput

  const trimmedInput = input.trim()
  const canSend = trimmedInput.length > 0 || Boolean(context)

  const onStart = async () => {
    if (isLoading || !canSend) {
      return
    }

    const contextValue = context?.trim()

    setInput('')
    setContext(null)
    writeSavedInput(null)

    await ask(
      trimmedInput.length > 0 ? trimmedInput : 'Use the provided context.',
      contextValue
    )
  }

  const handleInputChange = (value: string) => {
    setInput(value)
    writeSavedInput(value)
  }

  return (
    <PromptInput onSubmit={onStart}>
      {context ? (
        <PromptInputHeader>
          <PromptContext context={context} onClear={() => setContext(null)} />
        </PromptInputHeader>
      ) : null}
      <PromptInputBody>
        <PromptInputTextarea
          aria-label='Ask Simba a question'
          autoFocus={finePointer}
          className={cn('min-h-16', isLoading && 'text-muted-foreground')}
          onChange={(event) => handleInputChange(event.target.value)}
          placeholder={isLoading ? 'Sniffing for answers…' : 'Ask Simba'}
          value={input}
        />
      </PromptInputBody>
      <PromptInputFooter>
        <PromptInputSubmit
          disabled={!(isStreaming || (canSend && !hasPendingToolInput))}
          onStop={stop}
          status={status}
        />
      </PromptInputFooter>
    </PromptInput>
  )
}

function PromptContext({
  context,
  onClear,
}: {
  context: string
  onClear: () => void
}) {
  return (
    <div className='flex w-full items-start gap-1.5 bg-background px-2 py-1.5 font-normal text-foreground text-xs'>
      <Icons.quote
        aria-hidden
        className='mt-0.5 size-3 shrink-0 text-muted-foreground'
      />
      <span className='line-clamp-2 flex-1 break-words'>
        <span className='sr-only'>Context: </span>
        {context.slice(0, 120)}
      </span>
      {/* The pseudo element grows the 14px icon's target to 24px */}
      <button
        aria-label='Remove context'
        className='after:-translate-1/2 relative inline-flex items-center justify-center text-muted-foreground transition-colors after:absolute after:top-1/2 after:left-1/2 after:size-6 hover:text-foreground'
        onClick={onClear}
        type='button'
      >
        <Icons.close className='size-3.5' />
      </button>
    </div>
  )
}
