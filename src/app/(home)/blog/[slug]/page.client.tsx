'use client'

import { Comments } from '@fuma-comment/react'
import { EllipsisIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
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

const cache = new Map<string, string>()

export function CopyMarkdown({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (copied) {
      return
    }
    const url = `/blog.mdx/${slug}`
    try {
      const cached = cache.get(url)
      if (cached) {
        await navigator.clipboard.writeText(cached)
      } else {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/plain': fetch(url)
              .then((r) => r.text())
              .then((text) => {
                cache.set(url, text)
                return text
              }),
          }),
        ])
      }
      setCopied(true)
      toast.success('Markdown copied')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  return (
    <Button
      className='h-7 gap-1.5'
      onClick={handleCopy}
      size='sm'
      variant='secondary'
    >
      {copied ? (
        <Icons.check className='size-3.5' />
      ) : (
        <Icons.post className='size-3.5' />
      )}
      Copy Page
    </Button>
  )
}

export function ShareMenu({ title, url }: { title: string; url: string }) {
  const iconRef = useRef<{
    startAnimation?: () => void
    stopAnimation?: () => void
  }>(null)

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
          className='size-7'
          onMouseEnter={() => iconRef.current?.startAnimation?.()}
          onMouseLeave={() => iconRef.current?.stopAnimation?.()}
          size='icon'
          variant='secondary'
        >
          <Icons.share className='size-3.5' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-44'>
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
