'use client'

import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import { PlusIcon, RefreshCw, XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import {
  PromptInput,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
} from '@/components/ai-elements/prompt-input'
import { animations, useClippy } from '@/components/clippy'
import { cn } from '@/lib/utils'
import { useChatContextValue } from './chat-context'

const StorageKeyInput = '__ai_search_input'

export function ChatInput() {
  const {
    chat: { status, sendMessage, stop, messages, setMessages, regenerate },
    pendingContext,
    setPendingContext,
  } = useChatContextValue()
  const { clippy } = useClippy()
  const [input, setInput] = useState(
    () => localStorage.getItem(StorageKeyInput) ?? ''
  )
  const isLoading = status === 'streaming' || status === 'submitted'
  const saveInput = useDebounceCallback(
    (value: string) => localStorage.setItem(StorageKeyInput, value),
    300
  )

  const lastAssistantMessage = messages.findLast((m) => m.role === 'assistant')
  const hasPendingToolInput = (lastAssistantMessage?.parts ?? []).some(
    (part) =>
      part.type === 'tool-showContactForm' && part.state === 'input-available'
  )

  const canRegenerate =
    status !== 'streaming' &&
    messages.length > 0 &&
    messages.at(-1)?.role === 'assistant'

  const canRestart = messages.length > 0

  const onSubmit = async ({ text }: { text: string }) => {
    if (clippy) {
      clippy.stopCurrent()
      clippy.play(animations.submit)
    }

    if (pendingContext) {
      await sendMessage({
        parts: [
          { type: 'data-context', data: { text: pendingContext } },
          { type: 'text', text },
        ],
      })
      setPendingContext(null)
    } else {
      await sendMessage({ text })
    }

    setInput('')
  }

  const handleInputChange = (value: string) => {
    setInput(value)
    saveInput(value)
  }

  useEffect(() => {
    if (isLoading) {
      document.getElementById('nd-ai-input')?.focus()
    }
  }, [isLoading])

  return (
    <div className='border-t border-dashed'>
      <PromptInput
        className='bg-fd-card text-fd-card-foreground'
        onSubmit={onSubmit}
      >
        {pendingContext && (
          <PromptInputHeader className='px-3 pt-2 pb-0'>
            <div className='flex w-full items-start justify-between gap-2 rounded border border-dashed bg-fd-muted/50 px-2 py-1.5 text-fd-muted-foreground text-xs'>
              <p className='line-clamp-2 flex-1'>
                <span className='font-medium text-fd-foreground'>Context:</span>{' '}
                {pendingContext}
              </p>
              <button
                className='mt-0.5 shrink-0 opacity-60 hover:opacity-100'
                onClick={() => setPendingContext(null)}
                type='button'
              >
                <XIcon className='size-3' />
              </button>
            </div>
          </PromptInputHeader>
        )}
        <PromptInputTextarea
          autoFocus
          className={cn(
            'min-h-18 resize-none bg-transparent px-3 py-3 focus-visible:ring-0',
            isLoading && 'text-fd-muted-foreground'
          )}
          disabled={isLoading}
          id='nd-ai-input'
          onChange={(event) => handleInputChange(event.target.value)}
          placeholder={isLoading ? 'Sniffing for answers...' : 'Ask Simba'}
          value={input}
        />
        <PromptInputFooter className='border-none px-2 pb-2'>
          <div className='flex items-center gap-1'>
            <button
              aria-hidden={!canRestart}
              className={cn(
                buttonVariants({
                  color: 'secondary',
                  size: 'icon-sm',
                  className:
                    'rounded-none border border-dashed transition-opacity duration-200 [&_svg]:size-4',
                }),
                canRestart ? 'opacity-100' : 'pointer-events-none opacity-0'
              )}
              disabled={!canRestart}
              onClick={() => setMessages([])}
              type='button'
            >
              <PlusIcon className='transition-transform hover:rotate-90' />
            </button>
            <button
              aria-hidden={!canRegenerate}
              className={cn(
                buttonVariants({
                  color: 'secondary',
                  size: 'icon-sm',
                  className:
                    'rounded-none border border-dashed transition-opacity duration-200 [&_svg]:size-4',
                }),
                canRegenerate ? 'opacity-100' : 'pointer-events-none opacity-0'
              )}
              disabled={!canRegenerate}
              onClick={() => regenerate()}
              tabIndex={canRegenerate ? 0 : -1}
              type='button'
            >
              <RefreshCw />
            </button>
          </div>
          <PromptInputSubmit
            className={cn(
              buttonVariants({
                color: 'primary',
                size: 'icon-sm',
                className:
                  'rounded-none border border-dashed transition-all [&_svg]:size-4',
              })
            )}
            disabled={hasPendingToolInput}
            onStop={stop}
            status={status}
          />
        </PromptInputFooter>
      </PromptInput>
    </div>
  )
}
