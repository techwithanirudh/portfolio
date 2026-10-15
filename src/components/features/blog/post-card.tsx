import Link from 'next/link'
import type React from 'react'
import { Icons } from '@/components/icons/icons'

interface PostCardProps {
  author: string
  date: string
  description: string
  title: string
  url: string
}

// Post row after chanhdai.com's blog list (MIT, (c) Chanh Dai)
export const PostCard: React.FC<PostCardProps> = ({
  title,
  description,
  url,
  date,
  author,
}) => (
  <Link
    className='group flex items-start gap-4 px-4 py-6 transition-colors hover:bg-card'
    data-sound-hover
    href={url}
  >
    <div className='flex min-w-0 flex-1 flex-col gap-1.5'>
      <h2 className='text-balance font-medium font-sans text-base tracking-tight transition-colors group-hover:text-primary'>
        {title}
      </h2>
      <p className='line-clamp-2 text-pretty text-muted-foreground text-sm'>
        {description}
      </p>
      <p className='font-mono text-muted-foreground text-xs'>
        {date} <span aria-hidden>·</span> {author}
      </p>
    </div>
    <Icons.arrowRight className='mt-1 size-4 shrink-0 text-muted-foreground transition-[rotate,translate,scale,color] duration-300 group-hover:-rotate-45 group-hover:text-foreground' />
  </Link>
)
