'use client'

import { Comments } from '@fuma-comment/react'
import { EllipsisIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getLoginUrl } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

export function ShareMenu({ title, url }: { title: string; url: string }) {
  const absoluteUrl =
    typeof window === 'undefined'
      ? url
      : new URL(url, window.location.origin).toString()

  const encoded = encodeURIComponent(absoluteUrl)

  const copyLink = async () => {
    await navigator.clipboard.writeText(absoluteUrl)
    toast.success('Link copied')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label='Share'
          className='w-full justify-start border-none shadow-none active:scale-none'
          size='sm'
          variant='secondary'
        >
          <Icons.share className='text-muted-foreground' />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='start'
        collisionPadding={8}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuItem onClick={copyLink}>
          <Icons.link className='size-4' />
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={`https://x.com/intent/tweet?url=${encoded}&text=${encodeURIComponent(title)}`}
            rel='noopener'
            target='_blank'
          >
            <Icons.x className='size-4' />
            Share on X
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite?url=${encoded}`}
            rel='noopener'
            target='_blank'
          >
            <Icons.linkedin className='size-4' />
            Share on LinkedIn
          </a>
        </DropdownMenuItem>
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault()
              navigator.share({ title, url: absoluteUrl }).catch(() => {})
            }}
          >
            <EllipsisIcon className='size-4' />
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
  const router = useRouter()

  return (
    <Comments
      auth={{
        type: 'api',
        signIn: () => {
          router.push(getLoginUrl(`/blog/${slug}`))
        },
      }}
      className={cn('w-full', className)}
      page={slug}
    />
  )
}
