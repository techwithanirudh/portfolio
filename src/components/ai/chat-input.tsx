'use client'

import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import { ArrowUpIcon, RefreshCw, SquareIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from '@/components/ai-elements/prompt-input'
import { animations, useClippy } from '@/components/clippy'
import { cn } from '@/lib/utils'
import { useChatContext } from './chat-context'

const StorageKeyInput = '__ai_search_input'

function ChatActions() {
  const { messages, status, regenerate } = useChatContext()
  const isLoading = status === 'streaming'
  const canShow =
    !isLoading && messages?.length > 0 && messages.at(-1)?.role === 'assistant'

  return (
    <button
      aria-hidden={!canShow}
      className={cn(
        buttonVariants({
          color: 'secondary',
          size: 'icon-sm',
          className:
            'gap-1.5 rounded-none border border-dashed transition-opacity duration-200 [&_svg]:size-4',
        }),
        canShow ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
      disabled={!canShow}
      onClick={() => regenerate()}
      tabIndex={canShow ? 0 : -1}
      type='button'
    >
      <RefreshCw />
    </button>
  )
}

export function ChatInput() {
  const { status, sendMessage, stop } = useChatContext()
  const { clippy } = useClippy()
  const [input, setInput] = useState(
    () => localStorage.getItem(StorageKeyInput) ?? ''
  )
  const isLoading = status === 'streaming' || status === 'submitted'
  const saveInput = useDebounceCallback(
    (value: string) => localStorage.setItem(StorageKeyInput, value),
    300
  )

  const onSubmit = async ({ text }: { text: string }) => {
    if (clippy) {
      clippy.stopCurrent()
      clippy.play(animations.submit)
    }
    await sendMessage({ text })
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
      <PromptInput onSubmit={onSubmit} className='bg-fd-card text-fd-card-foreground'>
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
          <ChatActions />
          <PromptInputSubmit
            className={cn(
              buttonVariants({
                color: 'primary',
                size: 'icon-sm',
                className:
                  'rounded-none border border-dashed transition-all [&_svg]:size-4',
              })
            )}
            status={status}
            onStop={stop}
          />
        </PromptInputFooter>
      </PromptInput>
    </div>
  )
}
