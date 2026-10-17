'use client'

import { Comments } from '@fuma-comment/react'
import { useSyncExternalStore } from 'react'
import { useSignInModal } from '@/components/features/auth/sign-in-modal'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIconItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'

const subscribeNoop = () => () => undefined

export function ShareMenu({ title, url }: { title: string; url: string }) {
  // The server can't know whether the browser has the Web Share API, so it
  // renders without it and the client snapshot takes over on hydration
  const canShare = useSyncExternalStore(
    subscribeNoop,
    () => 'share' in navigator,
    () => false
  )
  const encoded = encodeURIComponent(url)

  const { copy } = useCopyToClipboard({
    onCopyError: () => toast.error('Unable to copy link'),
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
        finalFocus={false}
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
                if (process.env.NODE_ENV !== 'production') {
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

export function PostComments({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  const { openSignIn } = useSignInModal()

  return (
    <Comments
      auth={{
        signIn: () => {
          openSignIn(`/blog/${slug}`)
        },
        type: 'api',
      }}
      className={cn('w-full', className)}
      page={slug}
    />
  )
}
