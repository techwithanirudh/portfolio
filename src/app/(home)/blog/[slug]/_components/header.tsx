import Link from 'next/link'
import { type ReactNode, ViewTransition } from 'react'
import { BlurImage } from '@/components/blur-image'
import { TagCard } from '@/components/features/blog'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { ViewAnimation } from '@/components/view-animation'
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
    <Section className='screen-line-top-none pt-6'>
      <div className='flex items-center justify-between gap-2 px-4 pb-4'>
        <Link
          className='group inline-flex items-center gap-1.5 font-mono text-muted-foreground text-xs transition-colors hover:text-foreground'
          href='/blog'
        >
          <Icons.arrowLeft className='size-3.5 transition-transform group-hover:-translate-x-0.5' />
          Blog
        </Link>
        {actions && <div className='flex items-center gap-2'>{actions}</div>}
      </div>

      <ViewTransition
        name={`blog/${page.slugs.join('/')}-title`}
        share='via-blur'
      >
        <h1 className='screen-line-top screen-line-bottom text-balance px-4 font-heading font-medium text-3xl tracking-tight sm:text-4xl'>
          {page.data.title ?? 'Untitled'}
        </h1>
      </ViewTransition>

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
          <div className='ml-auto flex flex-wrap gap-1.5'>
            <dt className='sr-only'>Tags</dt>
            {tags.map((tag) => (
              <dd key={tag}>
                <TagCard className='h-6 px-2 text-xs' name={tag} />
              </dd>
            ))}
          </div>
        ) : null}
      </dl>

      {image && (
        <ViewAnimation
          blur={false}
          initial={{ opacity: 0, scale: 0.99 }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          <div className='p-2'>
            <BlurImage
              alt={page.data.title ?? 'Blog cover image'}
              className='relative aspect-[2/1] w-full overflow-hidden rounded-xl border border-line'
              fill
              imageClassName='object-cover'
              sizes='(min-width: 768px) 768px, 100vw'
              src={image}
            />
          </div>
        </ViewAnimation>
      )}
    </Section>
  )
}
