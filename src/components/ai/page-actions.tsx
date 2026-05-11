'use client'

import { useSound } from '@web-kits/audio/react'
import { useMemo, useRef, useState } from 'react'

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

  return { state, isCopying, handleCopy }
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
      disabled={isCopying}
      onClick={onClick}
      size='sm'
      type='button'
      variant='secondary'
    >
      <CopyStateIcon
        doneIcon={<Icons.check className='text-muted-foreground' />}
        errorIcon={<Icons.x className='text-destructive' />}
        idleIcon={<Icons.copy className='text-muted-foreground' />}
        state={state}
      />
      <span>Copy Page</span>
    </Button>
  )
}

export function ViewOptions({
  markdownUrl,
  githubUrl,
  disabled = false,
}: {
  markdownUrl: string
  githubUrl: string
  disabled?: boolean
}) {
  const items = useMemo(() => {
    const fullMarkdownUrl =
      typeof window === 'undefined'
        ? 'loading'
        : new URL(markdownUrl, window.location.origin).toString()

    const q = `Read ${fullMarkdownUrl}, I want to ask questions about it.`

    return [
      {
        title: 'View as Markdown',
        href: fullMarkdownUrl,
        icon: Icons.markdown,
      },
      {
        title: 'Open in GitHub',
        href: githubUrl,
        icon: Icons.github,
      },
      {
        title: 'Open in Scira AI',
        href: `https://scira.ai/?${new URLSearchParams({ q })}`,
        icon: Icons.scira,
      },
      {
        title: 'Open in ChatGPT',
        href: `https://chatgpt.com/?${new URLSearchParams({ hints: 'search', q })}`,
        icon: Icons.openai,
      },
      {
        title: 'Open in Claude',
        href: `https://claude.ai/new?${new URLSearchParams({ q })}`,
        icon: Icons.claude,
      },
      {
        title: 'Open in T3 Chat',
        href: `https://t3.chat/new?${new URLSearchParams({ q })}`,
        icon: Icons.messageCircle,
      },
    ]
  }, [githubUrl, markdownUrl])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label='View Options'
          className='size-8 border-none shadow-none active:scale-none'
          disabled={disabled}
          size='icon-sm'
          variant='secondary'
        >
          <Icons.chevronDown className='mt-0.5 size-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='w-full max-w-full'
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {items.map(({ title, href, icon: Icon }) => (
          <DropdownMenuItem asChild key={href}>
            <a href={href} rel='noopener' target='_blank'>
              <Icon />
              {title}
            </a>
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

  return (
    <ButtonGroup className='w-full min-w-0'>
      <LLMCopyButton isCopying={isCopying} onClick={handleCopy} state={state} />
      <ButtonGroupSeparator className='border-secondary border-y-4 data-vertical:my-0 dark:bg-white/20' />
      <ViewOptions
        disabled={isCopying}
        githubUrl={githubUrl}
        markdownUrl={markdownUrl}
      />
    </ButtonGroup>
  )
}
