'use client'

import { Comments } from '@fuma-comment/react'
import { type ComponentType, useEffect, useState } from 'react'
import { useSignInModal } from '@/components/features/auth/sign-in-modal'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'

const itemClassName = 'gap-2.5 rounded-lg p-1.5 pr-2 font-medium'

const ShareIcon = ({
  icon: Icon,
}: {
  icon: ComponentType<{ className?: string }>
}) => (
  <span className='flex size-7 shrink-0 items-center justify-center rounded-md bg-muted ring-1 ring-border'>
    <Icon className='size-4' />
  </span>
)

export function ShareMenu({ title, url }: { title: string; url: string }) {
  const [canShare, setCanShare] = useState(false)
  const encoded = encodeURIComponent(url)

  useEffect(() => {
    setCanShare('share' in navigator)
  }, [])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied')
    } catch {
      toast.error('Unable to copy link')
    }
  }

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
        <DropdownMenuItem className={itemClassName} onClick={copyLink}>
          <ShareIcon icon={Icons.link} />
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem
          className={itemClassName}
          render={
            <a
              aria-label='Share on X'
              href={`https://x.com/intent/tweet?url=${encoded}&text=${encodeURIComponent(title)}`}
              rel='noopener'
              target='_blank'
            />
          }
        >
          <ShareIcon icon={Icons.x} />
          Share on X
        </DropdownMenuItem>
        <DropdownMenuItem
          className={itemClassName}
          render={
            <a
              aria-label='Share on LinkedIn'
              href={`https://www.linkedin.com/sharing/share-offsite?url=${encoded}`}
              rel='noopener'
              target='_blank'
            />
          }
        >
          <ShareIcon icon={Icons.linkedin} />
          Share on LinkedIn
        </DropdownMenuItem>
        {canShare && (
          <DropdownMenuItem
            className={itemClassName}
            onClick={() => {
              navigator.share({ title, url }).catch((error) => {
                if (process.env.NODE_ENV !== 'production') {
                  console.error(error)
                }
              })
            }}
          >
            <ShareIcon icon={Icons.moreHorizontal} />
            More
          </DropdownMenuItem>
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
