import { format } from 'date-fns'
import { ArrowRight, PenLine } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getWriting } from '../../_shared/profile'
import { Tile, TileHeader } from './tile'

export function LatestPostTile() {
  const post = getWriting()[0]
  if (!post) {
    return null
  }
  return (
    <Tile md={3} span={4}>
      <TileHeader
        aside={
          <time
            className='vs-num text-[12px] text-[var(--muted)]'
            dateTime={post.date.toISOString()}
          >
            {format(post.date, 'd MMM yyyy')}
          </time>
        }
        icon={PenLine}
        title='Latest post'
      />
      <Link className='group flex flex-1 flex-col gap-3' href={post.url}>
        <div className='relative aspect-[1200/630] overflow-hidden rounded-xl bg-[var(--panel-raised)]'>
          {post.image ? (
            <Image
              alt=''
              className='object-cover transition-transform duration-300 group-hover:scale-[1.02]'
              fill
              sizes='(min-width: 1024px) 360px, 100vw'
              src={post.image}
            />
          ) : (
            <span className='vs-label absolute inset-0 grid place-items-center'>
              [cover image]
            </span>
          )}
        </div>
        <div>
          <p className='font-medium text-[15px] leading-snug underline-offset-4 group-hover:underline'>
            {post.title}
          </p>
          <p className='mt-1 line-clamp-2 text-[13px] text-[var(--muted)]'>
            {post.description}
          </p>
        </div>
        <span className='mt-auto inline-flex items-center gap-1 text-[13px] text-[var(--muted)] transition-colors group-hover:text-[var(--text)]'>
          Read post
          <ArrowRight
            aria-hidden
            className='size-3.5 transition-transform group-hover:translate-x-0.5'
          />
        </span>
      </Link>
    </Tile>
  )
}
