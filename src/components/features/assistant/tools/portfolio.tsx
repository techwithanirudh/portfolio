'use client'

import {
  defineRegistry,
  JSONUIProvider,
  Renderer,
  useStateValue,
} from '@json-render/react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import type { Activity } from '@/components/features/contributions'
import { ExperienceTimeline } from '@/components/features/experience/experience-timeline'
import { preloadCover } from '@/components/features/projects/cover'
import { Icons } from '@/components/icons/icons'
import {
  type PortfolioState,
  portfolioCatalog,
  statePath,
} from '@/lib/ai/chat/catalog'
import { formatDate } from '@/lib/format-date'
import { cn } from '@/lib/utils'
import { eyebrow } from '../class-names'
import { ContributionsCard } from './portfolio-contributions'
import { PostRow, ProjectRow } from './portfolio-row'
import { TestimonialQuote } from './portfolio-testimonial'
import { ToolPendingLine, ToolWarningLine } from './status-line'
import type { ToolPart } from './types'

function StackGroup({
  children,
  title,
}: {
  children?: ReactNode
  title: string | null
}) {
  return (
    <section className='dashed-stack'>
      {title && <h3 className={cn('px-3 py-2', eyebrow)}>{title}</h3>}
      {children}
    </section>
  )
}

type PortfolioCollection = Parameters<typeof statePath>[0]

function usePortfolioState<C extends PortfolioCollection>(
  collection: C
): PortfolioState[C] | undefined
function usePortfolioState<C extends PortfolioCollection>(
  collection: C,
  key: string
): PortfolioState[C][string] | undefined
function usePortfolioState(collection: PortfolioCollection, key?: string) {
  return useStateValue(
    key === undefined ? `/${collection}` : statePath(collection, key)
  )
}

function ProjectItemRow({ slug }: { slug: string }) {
  const project = usePortfolioState('projects', slug)
  if (!project) {
    return null
  }
  const { date, description, image, title, url } = project
  const warmCover = () => image && preloadCover(image, title)
  return (
    <ProjectRow
      description={description}
      image={image}
      meta={
        <time
          className='text-foreground/80 tabular-nums'
          dateTime={date.slice(0, 10)}
        >
          {date.slice(0, 4)}
        </time>
      }
      onFocus={warmCover}
      onPointerEnter={warmCover}
      title={title}
      transitionTypes={['project-card']}
      url={url}
    />
  )
}

function PostItemRow({ slug }: { slug: string }) {
  const post = usePortfolioState('posts', slug)
  if (!post) {
    return null
  }
  const { date, description, tags, title, url } = post
  const time = <time dateTime={date.slice(0, 10)}>{formatDate(date)}</time>
  return (
    <PostRow
      date={time}
      description={description}
      meta={
        <>
          {time}
          {tags?.slice(0, 2).map((tag) => (
            <span key={tag}>
              <span aria-hidden className='px-1.5 opacity-60'>
                ·
              </span>
              {tag}
            </span>
          ))}
        </>
      }
      title={title}
      url={url}
    />
  )
}

function MoreLinkRow({
  children,
  href,
}: {
  children: ReactNode
  href: string
}) {
  return (
    <Link
      className='group flex items-center justify-between gap-2 px-3 wide:px-4 py-2 font-medium text-sm transition-colors hover:bg-card focus-visible:bg-card focus-visible:-outline-offset-2'
      href={href}
    >
      {children}
      <Icons.arrowRight
        aria-hidden
        className='icon-arrow size-4 shrink-0 text-muted-foreground group-hover:text-foreground group-focus-visible:text-foreground'
      />
    </Link>
  )
}

function ExperienceItems({ ids }: { ids: string[] }) {
  const experience = usePortfolioState('experience')
  const items = ids.flatMap((id) => experience?.[id] ?? [])
  // The frame and the stack's dividers already draw the line above it
  return items.length > 0 ? (
    <ExperienceTimeline className='border-t-0' experiences={items} />
  ) : null
}

function TestimonialItems({ ids }: { ids: string[] }) {
  const testimonials = usePortfolioState('testimonials')
  const items = ids.flatMap((id) => testimonials?.[id] ?? [])
  return items.length > 0 ? (
    <div className='dashed-stack'>
      {items.map((item) => (
        <TestimonialQuote key={item.id} testimonial={item} />
      ))}
    </div>
  ) : null
}

function ContributionsItem() {
  const contributions = useStateValue<Activity[]>('/contributions')
  return <ContributionsCard data={contributions ?? []} />
}

const { registry } = defineRegistry(portfolioCatalog, {
  components: {
    Contributions: () => <ContributionsItem />,
    Experience: ({ props }) => <ExperienceItems ids={props.ids} />,
    MoreLink: ({ props }) => (
      <MoreLinkRow href={props.href}>{props.label}</MoreLinkRow>
    ),
    Post: ({ props }) => <PostItemRow slug={props.slug} />,
    Project: ({ props }) => <ProjectItemRow slug={props.slug} />,
    Stack: ({ children, props }) => (
      <StackGroup title={props.title}>{children}</StackGroup>
    ),
    Testimonials: ({ props }) => <TestimonialItems ids={props.ids} />,
  },
})

export function PortfolioPart({ part }: { part: ToolPart<'renderPortfolio'> }) {
  const output = part.state === 'output-available' ? part.output : null

  if (part.state === 'output-error' || output?.success === false) {
    return <ToolWarningLine>couldn&apos;t fetch those</ToolWarningLine>
  }

  if (!output) {
    return (
      <ToolPendingLine icon={Icons.work}>fetching the cards…</ToolPendingLine>
    )
  }

  return (
    <div className='not-prose overflow-hidden rounded-md border border-dashed'>
      <JSONUIProvider initialState={output.spec.state} registry={registry}>
        <Renderer registry={registry} spec={output.spec} />
      </JSONUIProvider>
    </div>
  )
}
