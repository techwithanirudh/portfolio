'use client'

import { useSound } from '@web-kits/audio/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CopyStateIcon } from '@/components/copy-button'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { CopyState } from '@/hooks/use-copy-to-clipboard'
import { copy as copySound } from '@/lib/audio/minimal'

const cache = new Map<string, string>()

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

export function LLMCopyButton({
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

export function ViewOptions({
  markdownUrl,
  githubUrl,
  disabled = false,
  menuWidth,
}: {
  markdownUrl: string
  githubUrl: string
  disabled?: boolean
  menuWidth?: number
}) {
  const items = useMemo(() => {
    const fullMarkdownUrl = markdownUrl

    const q = `Read ${fullMarkdownUrl}, I want to ask questions about it.`

    return [
      {
        href: fullMarkdownUrl,
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
        className='max-w-none gap-0.5 rounded-xl p-1.5'
        finalFocus={false}
        style={menuWidth ? { width: menuWidth } : undefined}
      >
        {items.map(({ title, href, icon: Icon }) => (
          <DropdownMenuItem
            className='group/item gap-2.5 rounded-lg p-1.5 pr-2 font-medium'
            key={href}
            render={
              <a
                aria-label={title}
                href={href}
                rel='noopener'
                target='_blank'
              />
            }
          >
            <span className='flex size-7 shrink-0 items-center justify-center rounded-md bg-muted ring-1 ring-border'>
              <Icon className='size-4' />
            </span>
            <span className='truncate'>{title}</span>
            <Icons.arrowUpRight className='ml-auto size-3.5 -translate-x-1 text-muted-foreground opacity-0 transition-[opacity,transform] duration-150 group-focus/item:translate-x-0 group-focus/item:opacity-100' />
          </DropdownMenuItem>
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
  const [menuWidth, setMenuWidth] = useState<number>()

  useEffect(() => {
    const group = groupRef.current
    if (!group) {
      return
    }
    const observer = new ResizeObserver(([entry]) =>
      setMenuWidth(entry?.borderBoxSize[0]?.inlineSize)
    )
    observer.observe(group)
    return () => observer.disconnect()
  }, [])

  return (
    <ButtonGroup className='w-full min-w-0' ref={groupRef}>
      <LLMCopyButton isCopying={isCopying} onClick={handleCopy} state={state} />
      <ButtonGroupSeparator className='border-secondary border-y-4 data-vertical:my-0 dark:bg-white/20' />
      <ViewOptions
        disabled={isCopying}
        githubUrl={githubUrl}
        markdownUrl={markdownUrl}
        menuWidth={menuWidth}
      />
    </ButtonGroup>
  )
}
