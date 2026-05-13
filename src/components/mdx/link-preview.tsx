import Link from 'next/link'
import type { ComponentProps } from 'react'
import { BlurImage } from '@/components/blur-image'
import { Icons } from '@/components/icons/icons'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import {
  getDisplayUrl,
  getLinkPreview,
  isExternalHttpUrl,
} from '@/lib/link-preview'
import { cn } from '@/lib/utils'

type LinkPreviewProps = ComponentProps<'a'>

export function LinkPreview({
  children,
  className,
  href,
  ...props
}: LinkPreviewProps) {
  if (href?.startsWith('/')) {
    return (
      <Link className={className} href={href} {...props}>
        {children}
      </Link>
    )
  }

  if (!(href && isExternalHttpUrl(href))) {
    return (
      <a className={className} href={href} {...props}>
        {children}
      </a>
    )
  }

  const preview = getLinkPreview(href)

  if (!preview) {
    return (
      <a
        className={className}
        href={href}
        rel='noopener noreferrer'
        target='_blank'
        {...props}
      >
        {children}
      </a>
    )
  }

  const displayUrl = getDisplayUrl(href)

  return (
    <HoverCard closeDelay={120} openDelay={180}>
      <HoverCardTrigger asChild>
        <a
          className={className}
          href={href}
          rel='noopener noreferrer'
          target='_blank'
          {...props}
        >
          {children}
        </a>
      </HoverCardTrigger>
      <HoverCardContent className='not-prose w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden border-dashed bg-card p-0 shadow-black/5 shadow-lg dark:shadow-black/20'>
        <a
          className='group block'
          href={href}
          rel='noopener noreferrer'
          target='_blank'
        >
          <BlurImage
            alt={`Preview of ${displayUrl}`}
            className='aspect-[1200/630] w-full bg-muted'
            height={preview.height}
            imageClassName='object-cover'
            src={preview.screenshotPath}
            width={preview.width}
          />
          <div className='flex items-center gap-2 border-border border-t border-dashed px-3 py-2.5 text-muted-foreground text-xs'>
            <span className='flex size-5 shrink-0 items-center justify-center rounded-sm bg-muted text-muted-foreground'>
              <Icons.globe className='size-3.5' />
            </span>
            <span className='min-w-0 flex-1 truncate'>{displayUrl}</span>
            <Icons.arrowUpRight className='size-3.5 shrink-0 transition-transform will-change-transform group-hover:scale-125' />
          </div>
        </a>
      </HoverCardContent>
    </HoverCard>
  )
}

export function LinkPreviewAnchor({ className, ...props }: LinkPreviewProps) {
  return <LinkPreview className={cn(className)} {...props} />
}
