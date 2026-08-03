import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { BlurImage } from '@/components/blur-image'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { getLinkPreview } from '@/lib/link-preview'

interface PreviewButtonProps {
  href: string
  icon?: ReactNode
  label: string
}

export function PreviewButton({ href, icon, label }: PreviewButtonProps) {
  const preview = getLinkPreview(href)
  const { hostname: displayUrl } = new URL(href)
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${displayUrl}&sz=32`

  return (
    <HoverCard closeDelay={120} openDelay={180}>
      <HoverCardTrigger asChild>
        <Button asChild size='sm' variant='secondary'>
          <Link href={href} rel='noopener noreferrer' target='_blank'>
            {icon}
            {label}
          </Link>
        </Button>
      </HoverCardTrigger>
      {preview && (
        <HoverCardContent className='not-prose w-[20rem] max-w-[calc(100vw-2rem)] overflow-hidden border-dashed bg-card p-0 shadow-black/5 shadow-lg dark:shadow-black/20'>
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
              {faviconUrl && (
                <Image
                  alt=''
                  className='size-4 shrink-0 rounded-sm object-contain'
                  height={16}
                  src={faviconUrl}
                  unoptimized
                  width={16}
                />
              )}
              <span className='min-w-0 flex-1 truncate'>{displayUrl}</span>
              <Icons.arrowUpRight className='size-3.5 shrink-0 transition-transform will-change-transform group-hover:scale-125' />
            </div>
          </a>
        </HoverCardContent>
      )}
    </HoverCard>
  )
}
