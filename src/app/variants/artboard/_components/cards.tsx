import { ArrowUpRight, Pin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Icons } from '@/components/icons/icons'
import { cn } from '@/lib/utils'
import { plain } from '../../_shared/profile'
import {
  type Experience,
  experienceInfo,
  experienceKind,
  type Position,
  type PostItem,
  postInfo,
  projectInfo,
  projectStatus,
  type WorkItem,
} from './data'
import { ImageFrame } from './figure'
import { Selectable } from './selectable'
import { formatDate, formatPeriod, isoDate } from './selection'

export function ProjectCard({
  className,
  hidden,
  item,
  priority,
}: {
  className?: string
  hidden?: boolean
  item: WorkItem
  priority?: boolean
}) {
  return (
    <Selectable
      className={cn('h-full', className)}
      hidden={hidden}
      info={projectInfo(item)}
      layer={`Project / ${item.title}`}
    >
      <article className='ab-rule flex h-full flex-col overflow-hidden rounded-md border bg-(--board)'>
        {item.image ? (
          <ImageFrame
            alt=''
            className='ab-rule aspect-[16/10] border-b'
            layer='cover'
            priority={priority}
            sizes='(min-width: 768px) 420px, 100vw'
            src={item.image}
          />
        ) : null}
        <div className='flex flex-1 flex-col gap-2 p-4'>
          <div className='flex items-baseline justify-between gap-3'>
            <h3
              className='font-semibold text-[17px] leading-6 tracking-[-0.01em]'
              data-layer='title'
              data-layer-type='text'
            >
              <Link
                className='ab-link no-underline hover:underline'
                href={item.url}
              >
                {item.title}
              </Link>
            </h3>
            <span className='ab-t-label flex flex-none items-center gap-1 text-(--muted)'>
              {item.pinned ? (
                <Pin aria-label='Pinned' className='size-3 text-(--sel)' />
              ) : null}
              {item.year}
            </span>
          </div>
          <p
            className='ab-t-small text-(--muted)'
            data-layer='description'
            data-layer-type='text'
          >
            {item.description}
          </p>
          <div className='mt-auto flex flex-wrap items-center gap-1 pt-2'>
            {item.tags.slice(0, 3).map((tag) => (
              <span className='ab-chip' key={tag}>
                {tag}
              </span>
            ))}
            {item.tags.length > 3 ? (
              <span className='ab-t-label text-(--faint)'>
                +{item.tags.length - 3}
              </span>
            ) : null}
            <span className='ab-t-label ml-auto text-(--faint)'>
              {projectStatus(item)}
            </span>
          </div>
        </div>
      </article>
    </Selectable>
  )
}

export function ExperienceRow({
  company,
  position,
}: {
  company: Experience
  position: Position
}) {
  const current = !position.employmentPeriod.end
  return (
    <Selectable
      info={experienceInfo(company, position)}
      layer={`Experience / ${company.companyName}`}
    >
      <article className='grid grid-cols-[40px_minmax(0,1fr)] gap-x-4 gap-y-1 py-4 sm:grid-cols-[40px_minmax(0,1fr)_auto]'>
        <span className='ab-rule relative row-span-2 block size-10 overflow-hidden rounded-md border bg-(--chip)'>
          {company.companyLogo ? (
            <Image
              alt=''
              className='object-cover'
              fill
              sizes='40px'
              src={company.companyLogo}
            />
          ) : (
            <span className='grid size-full place-items-center text-(--muted)'>
              <Icons.globe className='size-4' />
            </span>
          )}
        </span>
        <div className='min-w-0'>
          <h3 className='flex flex-wrap items-center gap-x-2 font-semibold text-[15px] leading-6'>
            {company.companyWebsite ? (
              <a
                className='ab-link no-underline hover:underline'
                href={company.companyWebsite}
                rel='noopener'
                target='_blank'
              >
                {company.companyName}
              </a>
            ) : (
              company.companyName
            )}
            {current ? (
              <span className='ab-chip h-[18px] bg-(--sel-fill) text-(--sel)'>
                Current
              </span>
            ) : null}
          </h3>
          <p className='text-(--muted) text-[13px] leading-5'>
            {position.title}
            {position.employmentType ? ` · ${position.employmentType}` : ''}
          </p>
        </div>
        <p className='ab-t-label col-start-2 text-(--muted) sm:col-start-3 sm:row-start-1 sm:text-right'>
          {formatPeriod(position.employmentPeriod)}
          <span className='block text-(--faint)'>
            {experienceKind(company)}
          </span>
        </p>
        <p className='ab-t-small col-start-2 max-w-[60ch] text-(--muted) sm:col-span-2'>
          {plain(position.description)}
        </p>
      </article>
    </Selectable>
  )
}

export function PostRow({ post }: { post: PostItem }) {
  return (
    <Selectable info={postInfo(post)} layer={`Post / ${post.title}`}>
      <article className='grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[112px_minmax(0,1fr)_auto]'>
        <time
          className='ab-t-label pt-1 text-(--muted)'
          dateTime={isoDate(post.date)}
        >
          {formatDate(post.date)}
        </time>
        <div className='min-w-0'>
          <h3 className='font-semibold text-[15px] leading-6'>
            <Link
              className='ab-link no-underline hover:underline'
              href={post.url}
            >
              {post.title}
            </Link>
          </h3>
          <p className='ab-t-small text-(--muted)'>{post.description}</p>
        </div>
        <ArrowUpRight
          aria-hidden
          className='hidden size-4 text-(--faint) sm:block'
        />
      </article>
    </Selectable>
  )
}
