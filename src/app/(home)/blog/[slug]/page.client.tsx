'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
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
        render={<Button aria-label='Share' size='sm' variant='toolbar' />}
      >
        <Icons.share className='text-muted-foreground' />
        Share
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' collisionPadding={8} finalFocus={false}>
        <DropdownMenuItem onClick={copyLink}>
          <Icons.link className='size-4' />
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem
          render={
            <a
              href={`https://x.com/intent/tweet?url=${encoded}&text=${encodeURIComponent(title)}`}
              rel='noopener'
              target='_blank'
            />
          }
        >
          <Icons.x className='size-4' />
          Share on X
        </DropdownMenuItem>
        <DropdownMenuItem
          render={
            <a
              href={`https://www.linkedin.com/sharing/share-offsite?url=${encoded}`}
              rel='noopener'
              target='_blank'
            />
          }
        >
          <Icons.linkedin className='size-4' />
          Share on LinkedIn
        </DropdownMenuItem>
        {canShare && (
          <DropdownMenuItem
            onClick={() => {
              navigator.share({ title, url }).catch((error) => {
                if (process.env.NODE_ENV !== 'production') {
                  console.error(error)
                }
              })
            }}
          >
            <Icons.moreHorizontal className='size-4' />
            More
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Comments pull in an editor and their own UI kit, so they only load as the
// reader nears the end of the post
const Comments = dynamic(
  () => import('@fuma-comment/react').then((mod) => mod.Comments),
  { ssr: false }
)

const useNearViewport = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || near) {
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true)
        }
      },
      { rootMargin: '600px 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [near])

  return { near, ref }
}

export function PostComments({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  const { openSignIn } = useSignInModal()
  const { near, ref } = useNearViewport()

  if (!near) {
    return <div className={cn('min-h-40 w-full', className)} ref={ref} />
  }

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
