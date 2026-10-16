'use client'

import Image from 'next/image'
import Link from 'next/link'
import { type ComponentProps, useState } from 'react'
import { BlurImage } from '@/components/blur-image'
import { Icons } from '@/components/icons/icons'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import type { LinkPreviewImage } from '@/lib/link-preview.shared'
import { getPagePreviewPath, type PagePreview } from '@/lib/page-preview'

type Preview = LinkPreviewImage | null

const previewRequests = new Map<string, Promise<unknown>>()

function fetchJson<T>(url: string): Promise<T | null> {
  let request = previewRequests.get(url)
  if (!request) {
    request = fetch(url)
      .then((response) => (response.ok ? response.json() : null))
      .catch(() => null)
    previewRequests.set(url, request)
  }
  return request as Promise<T | null>
}

const fetchPreview = (href: string) =>
  fetchJson<LinkPreviewImage>(
    `/api/link-preview?url=${encodeURIComponent(href)}`
  )

const fetchPagePreview = (path: string) =>
  fetchJson<PagePreview>(`/api/page-preview?path=${encodeURIComponent(path)}`)

const externalHrefPattern = /^https?:\/\//
const internalHrefPattern = /^\/(?!\/)/

const popupClassName =
  'not-prose w-80 max-w-[calc(100vw-2rem)] overflow-hidden p-0'

const externalLinkProps = { rel: 'noopener noreferrer', target: '_blank' }

interface PreviewLinkProps extends Omit<ComponentProps<'a'>, 'href'> {
  href: string
  preview?: Preview
}

export function PreviewLink({ href, preview, ...props }: PreviewLinkProps) {
  const pagePath = getPagePreviewPath(href)
  const external = externalHrefPattern.test(href)

  if (pagePath || (external && preview !== null)) {
    return (
      <HoverPreviewLink
        href={href}
        pagePath={pagePath}
        preview={preview}
        {...props}
      />
    )
  }

  if (internalHrefPattern.test(href)) {
    return <Link href={href} {...props} />
  }

  return <a href={href} {...(external && externalLinkProps)} {...props} />
}

function HoverPreviewLink({
  children,
  href,
  onPointerEnter,
  pagePath,
  preview: knownPreview,
  ...props
}: PreviewLinkProps & { pagePath: string | null }) {
  const [fetchedPreview, setFetchedPreview] = useState<Preview>()
  const preview = knownPreview === undefined ? fetchedPreview : knownPreview
  const [pagePreview, setPagePreview] = useState<PagePreview | null>()

  const load = () => {
    if (pagePath) {
      if (pagePreview === undefined) {
        fetchPagePreview(pagePath).then(setPagePreview)
      }
    } else if (preview === undefined) {
      fetchPreview(href).then(setFetchedPreview)
    }
  }

  return (
    <HoverCard onOpenChange={(open) => open && load()}>
      <HoverCardTrigger
        closeDelay={120}
        delay={300}
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') {
            load()
          }
          onPointerEnter?.(event)
        }}
        {...(pagePath
          ? { render: <Link href={href} /> }
          : { href, ...externalLinkProps })}
        {...props}
      >
        {children}
      </HoverCardTrigger>
      {pagePreview && <PagePreviewPopup href={href} preview={pagePreview} />}
      {!pagePath && preview && (
        <LinkPreviewPopup href={href} preview={preview} />
      )}
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
    <HoverCardContent className={popupClassName}>
      <a
        className='group block'
        href={href}
        tabIndex={-1}
        {...externalLinkProps}
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
        <div className='flex items-center gap-2 border-t px-3 py-2.5 text-muted-foreground text-xs'>
          <Image
            alt=''
            className='size-4 shrink-0 rounded-sm object-contain'
            height={16}
            src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
            unoptimized
            width={16}
          />
          <span className='min-w-0 flex-1 truncate'>{hostname}</span>
          <Icons.arrowUpRight className='size-3.5 shrink-0 transition-transform group-hover:scale-125' />
        </div>
      </a>
    </HoverCardContent>
  )
}

function PagePreviewPopup({
  href,
  preview,
}: {
  href: string
  preview: PagePreview
}) {
  return (
    <HoverCardContent className={popupClassName}>
      <Link className='group block' href={href} tabIndex={-1}>
        {preview.image && (
          <BlurImage
            alt={preview.title}
            className='relative aspect-video w-full overflow-hidden border-b bg-muted'
            fill
            imageClassName='object-cover'
            sizes='20rem'
            src={preview.image}
          />
        )}
        <div className='flex items-start gap-2 px-3 py-2.5'>
          <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
            <span className='truncate font-medium text-sm transition-colors group-hover:text-primary'>
              {preview.title}
            </span>
            {preview.description && (
              <span className='line-clamp-2 text-muted-foreground text-xs'>
                {preview.description}
              </span>
            )}
          </div>
          <Icons.arrowRight className='mt-0.5 size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground' />
        </div>
      </Link>
    </HoverCardContent>
  )
}
