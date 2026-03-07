'use client'

import type { CodeBlockProps } from 'fumadocs-ui/components/codeblock'
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock'
import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import { Github } from 'lucide-react'
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

export function GitHubCodeBlockClient({
  code,
  lang,
  sourceUrl,
  allowCopy = true,
  keepBackground = true,
  icon,
  title,
}: GitHubCodeBlockClientProps) {
  return (
    <DynamicCodeBlock
      code={code}
      codeblock={{
        Actions: ({ className, children }) => (
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
        ),
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
