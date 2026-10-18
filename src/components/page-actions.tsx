'use client'

import { useSound } from '@web-kits/audio/react'
import { type RefObject, useMemo, useRef, useState } from 'react'
import { CopyStateIcon } from '@/components/copy-state-icon'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIconItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { CopyState } from '@/hooks/use-copy-to-clipboard'
import { copy as copySound } from '@/lib/audio/minimal'
import { cn } from '@/lib/utils'

const cache = new Map<string, string>()

// TODO(slopradar): duplication: re-implements useCopyToClipboard (state machine, 1500ms reset, sound) because that hook only takes a string; extend the hook to accept a Promise<string> and use it here, which also brings its haptics and timer cleanup
function useMarkdownCopy(markdownUrl: string) {
  const [state, setState] = useState<CopyState>('idle')
  const [isCopying, setIsCopying] = useState(false)
  const operationRef = useRef(false)
  const playSound = useSound(copySound)

  const handleCopy = async () => {
    if (operationRef.current) {
      return
    }
    operationRef.current = true

    const loadingTimer = setTimeout(() => setIsCopying(true), 150)

    try {
      const cached = cache.get(markdownUrl)
      if (cached) {
        await navigator.clipboard.writeText(cached)
      } else {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/plain': fetch(markdownUrl).then(async (res) => {
              if (!res.ok) {
                throw new Error(`Failed to fetch markdown: ${res.status}`)
              }
              const content = await res.text()
              cache.set(markdownUrl, content)
              return content
            }),
          }),
        ])
      }
      playSound()
      setState('done')
    } catch {
      setState('error')
    } finally {
      clearTimeout(loadingTimer)
      setIsCopying(false)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      operationRef.current = false
      setState('idle')
    }
  }

  return { handleCopy, isCopying, state }
}

function LLMCopyButton({
  state,
  isCopying,
  onClick,
}: {
  state: CopyState
  isCopying: boolean
  onClick: () => void
}) {
  return (
    <Button
      aria-busy={isCopying}
      className='min-w-0 flex-1 justify-start border-none shadow-none active:scale-none'
      data-sound-press='off'
      disabled={isCopying}
      onClick={onClick}
      size='sm'
      type='button'
      variant='secondary'
    >
      <CopyStateIcon className='text-muted-foreground' state={state} />
      <span>Copy page</span>
    </Button>
  )
}

function ViewOptions({
  anchor,
  markdownUrl,
  githubUrl,
  disabled = false,
}: {
  /** Element the menu lines up with and takes its width from */
  anchor?: RefObject<HTMLElement | null>
  markdownUrl: string
  githubUrl: string
  disabled?: boolean
}) {
  const items = useMemo(() => {
    const q = `Read ${markdownUrl}, I want to ask questions about it.`

    return [
      {
        href: markdownUrl,
        icon: Icons.markdown,
        title: 'View as Markdown',
      },
      {
        href: githubUrl,
        icon: Icons.github,
        title: 'Open in GitHub',
      },
      {
        href: `https://chatgpt.com/?${new URLSearchParams({ hints: 'search', q })}`,
        icon: Icons.openai,
        title: 'Open in ChatGPT',
      },
      {
        href: `https://claude.ai/new?${new URLSearchParams({ q })}`,
        icon: Icons.claude,
        title: 'Open in Claude',
      },
    ]
  }, [githubUrl, markdownUrl])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            aria-label='View options'
            // TODO(slopradar): redundant-class: size-8 is exactly what size='icon-sm' already sets, drop it
            className='size-8 border-none shadow-none active:scale-none'
            disabled={disabled}
            size='icon-sm'
            variant='secondary'
          />
        }
      >
        <Icons.chevronDown className='mt-0.5 size-4' />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        anchor={anchor}
        className={cn(
          'max-w-none gap-0.5 rounded-xl p-1.5',
          anchor && 'w-(--anchor-width)'
        )}
        finalFocus={false}
      >
        {items.map(({ title, href, icon }) => (
          <DropdownMenuIconItem
            className='group/item'
            icon={icon}
            key={href}
            render={
              <a
                // TODO(slopradar): redundant-aria: aria-label repeats the visible title, and rel='noopener' differs from the 'noopener noreferrer' every other external link uses; drop aria-label and share one external-link props constant
                aria-label={title}
                href={href}
                rel='noopener'
                target='_blank'
              />
            }
          >
            <span className='truncate'>{title}</span>
            <Icons.arrowUpRight className='group-focus/item:translate-0 motion-reduce:translate-0 ml-auto size-3.5 -translate-x-0.5 translate-y-0.5 text-muted-foreground opacity-0 transition-[opacity,translate] duration-200 ease-out-strong group-focus/item:opacity-100' />
          </DropdownMenuIconItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function LLMCopyButtonWithViewOptions({
  markdownUrl,
  githubUrl,
}: {
  markdownUrl: string
  githubUrl: string
}) {
  const { state, isCopying, handleCopy } = useMarkdownCopy(markdownUrl)
  const groupRef = useRef<HTMLDivElement>(null)

  return (
    <ButtonGroup className='w-full min-w-0' ref={groupRef}>
      <LLMCopyButton isCopying={isCopying} onClick={handleCopy} state={state} />
      <ButtonGroupSeparator className='border-secondary border-y-4 data-vertical:my-0 dark:bg-white/20' />
      <ViewOptions
        anchor={groupRef}
        disabled={isCopying}
        githubUrl={githubUrl}
        markdownUrl={markdownUrl}
      />
    </ButtonGroup>
  )
}
