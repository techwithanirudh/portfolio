'use client'

import Image from 'next/image'
import { type ComponentProps, useState } from 'react'
import { BlurImage } from '@/components/blur-image'
import { Icons } from '@/components/icons/icons'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import type { LinkPreviewImage } from '@/lib/link-preview.shared'

type Preview = LinkPreviewImage | null

const previewRequests = new Map<string, Promise<Preview>>()

function fetchPreview(href: string): Promise<Preview> {
  let request = previewRequests.get(href)
  if (!request) {
    request = fetch(`/api/link-preview?url=${encodeURIComponent(href)}`)
      .then((response) => (response.ok ? response.json() : null))
      .catch(() => null)
    previewRequests.set(href, request)
  }
  return request
}

const externalHrefPattern = /^https?:\/\//

interface PreviewLinkProps extends ComponentProps<typeof HoverCardTrigger> {
  href: string
  /** Skips the lazy lookup when the preview is already known; null disables the card. */
  preview?: Preview
}

export function PreviewLink({
  children,
  href,
  onPointerEnter,
  preview: knownPreview,
  ...props
}: PreviewLinkProps) {
  const external = externalHrefPattern.test(href)
  const [preview, setPreview] = useState(knownPreview)

  const load = () => {
    if (external && preview === undefined) {
      fetchPreview(href).then(setPreview)
    }
  }

  return (
    <HoverCard onOpenChange={(open) => open && load()}>
      <HoverCardTrigger
        closeDelay={120}
        delay={300}
        href={href}
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') {
            load()
          }
          onPointerEnter?.(event)
        }}
        rel={external ? 'noopener noreferrer' : undefined}
        target={external ? '_blank' : undefined}
        {...props}
      >
        {children}
      </HoverCardTrigger>
      {preview && <LinkPreviewPopup href={href} preview={preview} />}
    </HoverCard>
  )
}

function LinkPreviewPopup({
  href,
  preview,
}: {
  href: string
  preview: LinkPreviewImage
}) {
  const { hostname } = new URL(href)

  return (
    <HoverCardContent className='not-prose w-80 max-w-[calc(100vw-2rem)] overflow-hidden border-line bg-card p-0 shadow-black/5 shadow-lg dark:shadow-black/20'>
      <a
        className='group block'
        href={href}
        rel='noopener noreferrer'
        target='_blank'
      >
        <BlurImage
          alt={`Preview of ${hostname}`}
          className='aspect-[1200/630] w-full bg-muted'
          height={preview.height}
          imageClassName='object-cover'
          sizes='20rem'
          src={preview.screenshotPath}
          width={preview.width}
        />
        <div className='flex items-center gap-2 border-line border-t px-3 py-2.5 font-mono text-muted-foreground text-xs'>
          <Image
            alt=''
            className='size-4 shrink-0 object-contain'
            height={16}
            src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
            unoptimized
            width={16}
          />
          <span className='min-w-0 flex-1 truncate'>{hostname}</span>
          <Icons.arrowUpRight className='size-3.5 shrink-0 transition-transform will-change-transform group-hover:scale-125' />
        </div>
      </a>
    </HoverCardContent>
  )
}
