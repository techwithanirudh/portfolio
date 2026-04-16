'use client'

import {
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  MessageCircleIcon,
} from 'lucide-react'
import type * as React from 'react'
import { useMemo, useState } from 'react'
import { useCopyButton } from 'fumadocs-ui/utils/use-copy-button'

import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const cache = new Map<string, string>()

function useMarkdownCopy(markdownUrl: string) {
  const [isCopying, setIsCopying] = useState(false)
  const [checked, onClick] = useCopyButton(async () => {
    const cached = cache.get(markdownUrl)
    if (cached) {
      await navigator.clipboard.writeText(cached)
      return
    }

    setIsCopying(true)

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': fetch(markdownUrl).then(async (res) => {
            const content = await res.text()
            cache.set(markdownUrl, content)

            return content
          }),
        }),
      ])
    } finally {
      setIsCopying(false)
    }
  })

  return { checked, isCopying, onClick }
}

export function LLMCopyButton({
  checked,
  isCopying,
  onClick,
}: {
  checked: boolean
  isCopying: boolean
  onClick: React.MouseEventHandler<HTMLButtonElement>
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
      {checked ? <CheckIcon className='text-muted-foreground' /> : <CopyIcon className='text-muted-foreground' />}
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
      typeof window !== 'undefined'
        ? new URL(markdownUrl, window.location.origin).toString()
        : 'loading'

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
        href: `https://chatgpt.com/?${new URLSearchParams({
          hints: 'search',
          q,
        })}`,
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
        icon: MessageCircleIcon,
      },
    ]
  }, [githubUrl, markdownUrl])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label='View Options'
          className='size-8 border-none active:scale-none'
          disabled={disabled}
          size='icon-sm'
          variant='secondary'
        >
          <ChevronDownIcon className='mt-0.5 size-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='max-w-full w-full'
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

// --- LLMCopyButtonWithViewOptions ---

export function LLMCopyButtonWithViewOptions({
  markdownUrl,
  githubUrl,
}: {
  markdownUrl: string
  githubUrl: string
}) {
  const { checked, isCopying, onClick } = useMarkdownCopy(markdownUrl)

  return (
    <ButtonGroup className='w-full min-w-0'>
      <LLMCopyButton
        checked={checked}
        isCopying={isCopying}
        onClick={onClick}
      />
      <ButtonGroupSeparator className='border-secondary border-y-4 data-vertical:my-0 dark:bg-white/20' />
      <ViewOptions
        disabled={isCopying}
        githubUrl={githubUrl}
        markdownUrl={markdownUrl}
      />
    </ButtonGroup>
  )
}
