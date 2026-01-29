'use client'

import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import { ArrowUpIcon, SquareIcon } from 'lucide-react'
import {
  type ComponentProps,
  type SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { animations, useClippy } from '@/components/clippy'
import { cn } from '@/lib/utils'
import { useChatContext } from './ai-search-context'

const StorageKeyInput = '__ai_search_input'

export function SearchAIInput(props: ComponentProps<'form'>) {
  const { status, sendMessage, stop } = useChatContext()
  const { clippy } = useClippy()
  const [input, setInput] = useState(
    () => localStorage.getItem(StorageKeyInput) ?? ''
  )
  const isLoading = status === 'streaming' || status === 'submitted'
  const hasPlayed = useRef(false)

  const playSearching = () => {
    if (!clippy) {
      return
    }
    clippy.stopCurrent()
    clippy.play(animations.submit)
  }

  const onStart = async (event?: SyntheticEvent) => {
    event?.preventDefault()
    playSearching()
    await sendMessage({ text: input })
    setInput('')
  }

  useEffect(() => {
    localStorage.setItem(StorageKeyInput, input)
  }, [input])

  useEffect(() => {
    if (clippy && !hasPlayed.current) {
      hasPlayed.current = true
    }
  }, [clippy])

  useEffect(() => {
    if (isLoading) {
      document.getElementById('nd-ai-input')?.focus()
    }
  }, [isLoading])

  return (
    <form
      {...props}
      className={cn('flex items-start pe-2', props.className)}
      onSubmit={onStart}
    >
      <Input
        autoFocus
        className={cn('p-3', isLoading && 'text-fd-muted-foreground')}
        disabled={status === 'streaming' || status === 'submitted'}
        onChange={(event) => {
          setInput(event.target.value)
        }}
        onKeyDown={(event) => {
          if (!event.shiftKey && event.key === 'Enter') {
            onStart(event)
          }
        }}
        placeholder={isLoading ? 'Sniffing for answers...' : 'Ask Simba'}
        value={input}
      />
      {isLoading ? (
        <button
          className={cn(
            buttonVariants({
              color: 'secondary',
              size: 'icon-sm',
              className:
                'mt-2 rounded-none border border-dashed transition-all [&_svg]:size-3.5',
            })
          )}
          key='bn'
          onClick={stop}
          type='button'
        >
          <SquareIcon className='fill-fd-foreground' />
        </button>
      ) : (
        <button
          className={cn(
            buttonVariants({
              color: 'primary',
              size: 'icon-sm',
              className:
                'mt-2 rounded-none border border-dashed transition-all [&_svg]:size-4',
            })
          )}
          disabled={input.length === 0}
          key='bn'
          type='submit'
        >
          <ArrowUpIcon />
        </button>
      )}
    </form>
  )
}

function Input(props: ComponentProps<'textarea'>) {
  const ref = useRef<HTMLDivElement>(null)
  const shared = cn('col-start-1 row-start-1', props.className)

  return (
    <div className='grid flex-1'>
      <textarea
        id='nd-ai-input'
        {...props}
        className={cn(
          'resize-none bg-transparent placeholder:text-fd-muted-foreground focus-visible:outline-none',
          shared
        )}
      />
      <div className={cn(shared, 'invisible break-all')} ref={ref}>
        {`${props.value?.toString() ?? ''}\n`}
      </div>
    </div>
  )
}
