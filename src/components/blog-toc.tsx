'use client'

import type { Root as PageTreeRoot } from 'fumadocs-core/page-tree'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { TOCPopover } from 'fumadocs-ui/layouts/docs/page/slots/toc'
import {
  TOC as GlassTOC,
  TOCProvider,
} from 'fumadocs-ui/layouts/glass/page/slots/toc'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export const BlogTocProvider = TOCProvider

export function BlogTocDesktop({ className }: { className?: string }) {
  const [top, setTop] = useState(140)

  useEffect(() => {
    const updateTop = () => {
      const article = document.querySelector('article')

      if (article) {
        setTop(Math.max(140, article.getBoundingClientRect().top + 64))
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

  return (
    <GlassTOC
      container={{
        className: cn(
          'lg:!grid lg:!fixed lg:!z-40 lg:max-[1799px]:!top-1/2 lg:max-[1799px]:!right-4 lg:max-[1799px]:!left-auto lg:max-[1799px]:!w-6 lg:max-[1799px]:!overflow-clip lg:max-[1799px]:!-translate-y-1/2 lg:max-[1799px]:hover:!w-[240px] lg:max-[1799px]:hover:!p-3 min-[1800px]:!right-auto min-[1800px]:!h-[calc(100vh-12rem)] min-[1800px]:!w-[180px] min-[1800px]:!items-start min-[1800px]:!p-0 min-[1800px]:!translate-y-0 min-[1800px]:![grid-area:auto] hidden',
          className
        ),
        style: {
          left: 'max(1rem, calc((100vw - 1400px) / 2 - 200px))',
          top,
        },
      }}
    />
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
        container={{
          className: cn('top-14 z-[60] mt-16 lg:hidden', className),
        }}
      />
    </DocsLayout>
  )
}
