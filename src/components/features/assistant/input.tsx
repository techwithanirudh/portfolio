'use client'

import { useSound } from '@web-kits/audio/react'
import { getStaticToolName, isStaticToolUIPart } from 'ai'
import { useState } from 'react'
import { useDebounceCallback, useMediaQuery } from 'usehooks-ts'
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input'
import { Icons } from '@/components/icons/icons'
import { toolConfirmationMap } from '@/lib/ai/chat/confirmation'
import type { ChatTools } from '@/lib/ai/chat/types'
import { send, tap } from '@/lib/audio/minimal'
import { MEDIA } from '@/lib/media'
import { cn } from '@/lib/utils'
import { isChatBusy, useChatContext } from './chat-context'
import { useAssistantContext } from './context'
import { useMascot } from './mascot'
import { animations } from './mascot/constants'

function RegenerateButton() {
  const { messages, status, regenerate } = useChatContext()
  const isLoading = status === 'streaming'
  const canShow =
    !isLoading && messages.length > 0 && messages.at(-1)?.role === 'assistant'
  const playRegenerate = useSound(tap)

  return (
    // TODO(slopradar): redundant-a11y: disabled already takes the native button out of the tab order and ignores pointer presses, so tabIndex={canShow ? 0 : -1} and pointer-events-none repeat it; keep disabled, aria-hidden and the opacity fade
    <PromptInputButton
      aria-hidden={!canShow}
      aria-label='Regenerate response'
      className={cn(
        'transition-opacity duration-200',
        canShow ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
      disabled={!canShow}
      onClick={() => {
        playRegenerate()
        regenerate()
      }}
      tabIndex={canShow ? 0 : -1}
    >
      <Icons.refresh className='icon-turn-button' />
    </PromptInputButton>
  )
}

const assistantInputStorageKey = 'simba:draft'
const MAX_SOURCE_PREVIEW_CHARS = 120

// TODO(slopradar): library-exists: usehooks-ts (already a dependency) ships useLocalStorage, which already survives throwing storage, replace readSavedInput/writeSavedInput with it (keep the debounce)
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

export function AssistantInput() {
  const { setContext, context } = useAssistantContext()
  const { status, sendMessage, stop, messages } = useChatContext()
  const mascot = useMascot()
  const playSend = useSound(send)
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
  const saveInput = useDebounceCallback(
    (value: string) => writeSavedInput(value),
    300
  )

  const trimmedInput = input.trim()
  const canSend = trimmedInput.length > 0 || Boolean(context)

  const onStart = async () => {
    if (isLoading || !canSend) {
      return
    }

    const contextValue = context?.trim()
    const messageText =
      trimmedInput.length > 0 ? trimmedInput : 'Use the provided context.'

    mascot?.setActivity(animations.submit)
    playSend()

    setInput('')
    setContext(null)
    saveInput.cancel()
    writeSavedInput(null)

    await sendMessage({
      parts: [
        {
          data: {
            location: window.location.href,
          },
          type: 'data-client',
        },
        {
          text: messageText,
          type: 'text',
        },
        ...(contextValue
          ? [
              {
                data: {
                  text: contextValue,
                },
                type: 'data-context' as const,
              },
            ]
          : []),
      ],
    })
  }

  const handleInputChange = (value: string) => {
    setInput(value)
    saveInput(value)
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
          // TODO(slopradar): dead-code: id='nd-ai-input' is a leftover from the fumadocs AI template that nothing reads (no selector, label or script references it), drop it
          id='nd-ai-input'
          onChange={(event) => handleInputChange(event.target.value)}
          placeholder={isLoading ? 'Sniffing for answers…' : 'Ask Simba'}
          value={input}
        />
      </PromptInputBody>
      <PromptInputFooter>
        <PromptInputTools>
          <RegenerateButton />
        </PromptInputTools>
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
        {context.slice(0, MAX_SOURCE_PREVIEW_CHARS)}
      </span>
      {/* TODO(slopradar): hit-area: the remove-context button is the bare 14px icon, extend it toward 40px with an after:-inset pseudo element like SearchToggle */}
      <button
        aria-label='Remove context'
        className='inline-flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground'
        onClick={onClear}
        type='button'
      >
        <Icons.close className='size-3.5' />
      </button>
    </div>
  )
}
