import Link from 'next/link'
import type { ReactNode } from 'react'
import { BackLink } from '@/components/back-link'
import { BlurImage } from '@/components/blur-image'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import type { BlogPage as MDXPage } from '@/lib/source'

const formatPostDate = (date: Date) =>
  date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

interface HeaderProps {
  actions?: ReactNode
  page: MDXPage
  tags?: string[]
}

// Post heading after chanhdai.com's doc pages (MIT, (c) Chanh Dai): back link,
// title between full-width lines, description, then the meta row and cover.
export const Header = ({ page, tags, actions }: HeaderProps) => {
  const image = page.data.image
  const lastModified = page.data.lastModified
    ? new Date(page.data.lastModified)
    : null

  return (
    <Section className='screen-line-top-none'>
      <div className='flex h-10 items-stretch justify-between gap-2'>
        <BackLink className='px-4' href='/blog'>
          Blog
        </BackLink>
        {actions && (
          <div className='flex items-stretch divide-x divide-line border-line border-l'>
            {actions}
          </div>
        )}
      </div>

      <h1 className='screen-line-top screen-line-bottom text-balance px-4 py-2 font-heading font-medium text-3xl tracking-tight sm:text-4xl'>
        {page.data.title ?? 'Untitled'}
      </h1>

      {page.data.description && (
        <p className='screen-line-bottom text-balance p-4 text-muted-foreground'>
          {page.data.description}
        </p>
      )}

      <dl className='screen-line-bottom flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 font-mono text-muted-foreground text-xs'>
        <div className='flex gap-1.5'>
          <dt className='sr-only'>Written by</dt>
          <dd>{page.data.author ?? 'Anirudh'}</dd>
        </div>
        <div className='flex gap-1.5'>
          <dt className='sr-only'>Published</dt>
          <dd>
            <time dateTime={new Date(page.data.date).toISOString()}>
              {formatPostDate(new Date(page.data.date))}
            </time>
          </dd>
        </div>
        {lastModified && (
          <div className='flex gap-1.5'>
            <dt>updated</dt>
            <dd>
              <time dateTime={lastModified.toISOString()}>
                {formatPostDate(lastModified)}
              </time>
            </dd>
          </div>
        )}
        {tags?.length ? (
          <div className='ml-auto flex flex-wrap gap-x-3 gap-y-1'>
            <dt className='sr-only'>Tags</dt>
            {tags.map((tag) => (
              <dd key={tag}>
                <Link
                  className='group inline-flex items-center gap-1 transition-colors hover:text-foreground'
                  href={`/blog/tags/${tag}`}
                >
                  <Icons.tag className='size-3.5 transition-transform will-change-transform group-hover:rotate-12 group-hover:scale-125' />
                  {tag}
                </Link>
              </dd>
            ))}
          </div>
        ) : null}
      </dl>

      {image && (
        // Flush like the project cover, and eager since it's the LCP
        <BlurImage
          alt={page.data.title ?? 'Blog cover image'}
          blur={false}
          className='relative aspect-[2/1] w-full bg-card/50'
          fill
          imageClassName='object-cover'
          lazy={false}
          sizes='(min-width: 768px) 768px, 100vw'
          src={image}
        />
      )}
    </Section>
  )
}
