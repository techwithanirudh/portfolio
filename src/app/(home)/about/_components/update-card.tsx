import Link from 'next/link'
import type React from 'react'
import { BlurImage } from '@/components/blur-image'
import { Icons } from '@/components/icons/icons'

interface UpdateCardProps {
  author: string
  date: string
  description: string
  image?: string | null
  slugs?: string[]
  tags?: string[]
  title: string
  url: string
}

export const UpdateCard: React.FC<UpdateCardProps> = ({
  title,
  description,
  image,
  url,
  date,
  author,
  tags: _tags,
  slugs: _slugs,
}) => (
  <Link
    className='group flex min-h-full flex-col gap-4 bg-card/50 p-6 transition-colors hover:bg-card/80'
    href={url}
  >
    {image && (
      <BlurImage
        alt={title}
        className='relative aspect-video w-full overflow-hidden rounded-lg bg-background transition-transform will-change-transform group-hover:scale-102'
        height={554}
        src={image}
        width={853}
      />
    )}

    <div className='flex flex-1 flex-col justify-between gap-4'>
      <div className='flex-1 space-y-2'>
        <h2 className='text-balance font-medium text-lg md:text-xl lg:text-2xl'>
          {title}
        </h2>
        <p className='line-clamp-3 overflow-hidden text-ellipsis text-pretty text-medium text-muted-foreground'>
          {description}
        </p>
      </div>
      <div className='inline-flex items-center gap-2 text-muted-foreground text-sm'>
        <span className='inline-flex items-center gap-1 capitalize'>
          <Icons.user className='icon-pop size-4' />
          {author}
        </span>
        <span>•</span>
        <span className='inline-flex items-center gap-1'>
          <Icons.calendar className='icon-pop size-4' />
          {date}
        </span>
      </div>
    </div>
  </Link>
)
