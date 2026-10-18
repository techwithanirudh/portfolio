'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { Icons } from '@/components/icons/icons'
import { cn } from '@/lib/utils'

// Simba's rows copy the an1rudh rebrand's home page lists (the project rows
// in _components/work.tsx and blog/post-card.tsx) at their `wide` size. In
// the docked panel and on phones they shrink to two lines, so a few fit in
// one answer: the title and description truncate, the cover shrinks, and the
// meta and arrow drop out the way the rebrand drops its meta column on phones

const rowLink =
  'group flex gap-3 px-3 py-2.5 transition-colors hover:bg-card focus-visible:bg-card focus-visible:-outline-offset-2 wide:gap-4 wide:px-4'

const rowTitle =
  'truncate font-medium text-sm tracking-tight transition-colors group-hover:text-primary group-focus-visible:text-primary wide:whitespace-normal wide:text-balance wide:text-base'

const rowDescription =
  'truncate text-[13px] text-muted-foreground wide:line-clamp-2 wide:whitespace-normal wide:text-pretty'

const RowArrow = ({ className }: { className?: string }) => (
  <Icons.arrowRight
    aria-hidden
    className={cn(
      'wide:block hidden size-4 shrink-0 text-muted-foreground transition-[rotate,translate,scale,color] duration-300 group-hover:-rotate-45 group-hover:text-foreground group-focus-visible:text-foreground motion-reduce:transition-none',
      className
    )}
  />
)

type RowLinkProps = Pick<
  ComponentProps<typeof Link>,
  'onFocus' | 'onPointerEnter' | 'transitionTypes'
>

interface ProjectRowProps extends RowLinkProps {
  description?: string
  image: string | null
  meta: ReactNode
  title: string
  url: string
}

export const ProjectRow = ({
  description,
  image,
  meta,
  title,
  url,
  ...linkProps
}: ProjectRowProps) => (
  <Link
    className={cn(rowLink, 'items-center wide:py-5')}
    href={url}
    {...linkProps}
  >
    {image ? (
      <Image
        // The title beside it already names the link
        alt=''
        className='h-10 wide:h-14 w-16 wide:w-24 shrink-0 rounded-[8px] border object-cover shadow-xs transition-[rotate,scale,box-shadow] duration-300 ease-out will-change-transform group-hover:-rotate-3 group-hover:scale-[1.06] group-hover:shadow-md motion-reduce:transition-none'
        height={56}
        sizes='96px'
        src={image}
        width={96}
      />
    ) : (
      <span className='h-10 wide:h-14 w-16 wide:w-24 shrink-0 rounded-[8px] bg-muted' />
    )}
    <div className='min-w-0 flex-1'>
      <h4 className={rowTitle}>{title}</h4>
      {description && <p className={rowDescription}>{description}</p>}
    </div>
    <div className='wide:flex hidden shrink-0 flex-col items-end gap-1 font-mono text-muted-foreground text-xs'>
      {meta}
    </div>
    <RowArrow />
  </Link>
)

interface PostRowProps {
  /** Shown beside the title in the docked panel, where the meta line drops */
  date: ReactNode
  description?: string
  meta: ReactNode
  title: string
  url: string
}

export const PostRow = ({
  date,
  description,
  meta,
  title,
  url,
}: PostRowProps) => (
  <Link className={cn(rowLink, 'items-start wide:py-6')} href={url}>
    <div className='flex min-w-0 flex-1 flex-col wide:gap-1.5'>
      <div className='flex items-baseline gap-2'>
        <h4 className={cn(rowTitle, 'min-w-0 flex-1')}>{title}</h4>
        <span className='wide:hidden shrink-0 font-mono text-muted-foreground text-xs tabular-nums'>
          {date}
        </span>
      </div>
      {description && (
        <p className={cn(rowDescription, 'wide:text-sm')}>{description}</p>
      )}
      <p className='wide:block hidden font-mono text-muted-foreground text-xs'>
        {meta}
      </p>
    </div>
    <RowArrow className='mt-1' />
  </Link>
)
