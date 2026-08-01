'use client'

import type { Root as PageTreeRoot } from 'fumadocs-core/page-tree'
import {
  TOCProvider,
  TOCScrollArea,
  useTOCItems,
} from 'fumadocs-ui/components/toc'
import {
  TOCItem as TOCItemDefault,
  TOCItems as TOCItemsDefault,
} from 'fumadocs-ui/components/toc/default'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { TOCPopover } from 'fumadocs-ui/layouts/docs/page/slots/toc'
import { useEffect, useState } from 'react'
import { Icons } from '@/components/icons/icons'
import { cn } from '@/lib/utils'

export const BlogTocProvider = TOCProvider

export function BlogTocDesktop({ className }: { className?: string }) {
  const items = useTOCItems()
  const [top, setTop] = useState(140)

  useEffect(() => {
    const updateTop = () => {
      const article = document.querySelector('article')

      if (article) {
        setTop(Math.max(140, article.getBoundingClientRect().top + 32))
      }
    }

    updateTop()
    window.addEventListener('scroll', updateTop, { passive: true })
    window.addEventListener('resize', updateTop)

    return () => {
      window.removeEventListener('scroll', updateTop)
      window.removeEventListener('resize', updateTop)
    }
  }, [])

  if (items.length === 0) {
    return null
  }

  return (
    <div
      className={cn(
        'fixed z-40 hidden h-[calc(100vh-12rem)] w-[180px] flex-col min-[1537px]:flex',
        className
      )}
      style={{
        left: 'max(1rem, calc((100vw - 1400px) / 2 - 200px))',
        top,
      }}
    >
      <h2 className='inline-flex items-center gap-1.5 text-fd-muted-foreground text-xs'>
        <Icons.menu className='size-3.5 shrink-0' />
        On this page
      </h2>
      <TOCScrollArea className='ms-px'>
        <TOCItemsDefault>
          {items.map((item) => (
            <TOCItemDefault item={item} key={item.url} />
          ))}
        </TOCItemsDefault>
      </TOCScrollArea>
    </div>
  )
}

const emptyTree: PageTreeRoot = { children: [], name: '' }

export function BlogTocMobile({ className }: { className?: string }) {
  return (
    <DocsLayout
      containerProps={{ style: { display: 'contents' } }}
      nav={{ enabled: false }}
      sidebar={{ enabled: false }}
      tree={emptyTree}
    >
      <TOCPopover
        container={{ className: cn('top-14 z-[60] lg:hidden', className) }}
      />
    </DocsLayout>
  )
}
