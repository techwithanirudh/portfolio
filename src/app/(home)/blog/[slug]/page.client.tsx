'use client'

import { useSyncExternalStore } from 'react'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIconItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { isProduction } from '@/constants'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { toast } from '@/lib/toast'

const subscribeNoop = () => () => undefined

export function ShareMenu({ title, url }: { title: string; url: string }) {
  const canShare = useSyncExternalStore(
    subscribeNoop,
    () => 'share' in navigator,
    () => false
  )
  const encoded = encodeURIComponent(url)

  const { copy } = useCopyToClipboard({
    onCopyError: () =>
      toast.error("Couldn't copy the link. Copy it from the address bar."),
    onCopySuccess: () => toast.success('Link copied'),
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            aria-label='Share'
            className='w-full justify-start border-none shadow-none active:scale-none'
            size='sm'
            variant='secondary'
          />
        }
      >
        <Icons.share className='text-muted-foreground' />
        Share
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='start'
        className='w-(--anchor-width) gap-0.5 rounded-xl p-1.5'
        collisionPadding={8}
        // Return focus only on a keyboard close, or Escape leaves keyboard users on <body>
        finalFocus={(closeType) => closeType === 'keyboard'}
      >
        <DropdownMenuIconItem icon={Icons.link} onClick={() => copy(url)}>
          Copy link
        </DropdownMenuIconItem>
        <DropdownMenuIconItem
          icon={Icons.x}
          render={
            <a
              aria-label='Share on X'
              href={`https://x.com/intent/tweet?url=${encoded}&text=${encodeURIComponent(title)}`}
              rel='noopener'
              target='_blank'
            />
          }
        >
          Share on X
        </DropdownMenuIconItem>
        <DropdownMenuIconItem
          icon={Icons.linkedin}
          render={
            <a
              aria-label='Share on LinkedIn'
              href={`https://www.linkedin.com/sharing/share-offsite?url=${encoded}`}
              rel='noopener'
              target='_blank'
            />
          }
        >
          Share on LinkedIn
        </DropdownMenuIconItem>
        {canShare && (
          <DropdownMenuIconItem
            icon={Icons.moreHorizontal}
            onClick={() => {
              navigator.share({ title, url }).catch((error) => {
                if (!isProduction) {
                  console.error(error)
                }
              })
            }}
          >
            More
          </DropdownMenuIconItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
