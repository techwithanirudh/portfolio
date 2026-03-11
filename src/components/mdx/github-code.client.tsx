'use client'

import type { CodeBlockProps } from 'fumadocs-ui/components/codeblock'
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock'
import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import { Github } from 'lucide-react'
import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface GitHubCodeBlockClientProps {
  code: string
  lang: string
  sourceUrl: string
  allowCopy?: CodeBlockProps['allowCopy']
  keepBackground?: CodeBlockProps['keepBackground']
  icon?: CodeBlockProps['icon']
  title?: string
}

function GitHubCodeBlockActions({
  className,
  children,
  sourceUrl,
}: {
  className: string
  children?: React.ReactNode
  sourceUrl: string
}) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {children}
      <a
        aria-label='Open source on GitHub'
        className={cn(
          buttonVariants({
            className:
              'text-fd-muted-foreground hover:text-fd-accent-foreground',
            size: 'icon-xs',
          })
        )}
        href={sourceUrl}
        rel='noopener noreferrer'
        target='_blank'
      >
        <Github />
      </a>
    </div>
  )
}

export function GitHubCodeBlockClient({
  code,
  lang,
  sourceUrl,
  allowCopy = true,
  keepBackground = true,
  icon,
  title,
}: GitHubCodeBlockClientProps) {
  const Actions = useMemo(
    () =>
      ({
        className,
        children,
      }: {
        className: string
        children: React.ReactNode
      }) => (
        <GitHubCodeBlockActions className={className} sourceUrl={sourceUrl}>
          {children}
        </GitHubCodeBlockActions>
      ),
    [sourceUrl]
  )

  return (
    <DynamicCodeBlock
      code={code}
      codeblock={{
        Actions,
        allowCopy,
        icon,
        keepBackground,
        title,
        lang,
        viewportProps: {
          className: 'max-w-full',
        },
      }}
      lang={lang}
    />
  )
}
