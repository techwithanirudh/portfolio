'use client'

import {
  defineRegistry,
  JSONUIProvider,
  Renderer,
  useStateValue,
} from '@json-render/react'
import type { ReactNode } from 'react'
import { PostRow } from '@/components/features/blog/post-row'
import { ExperienceTimeline, WorkCard } from '@/components/features/work'
import { Icons } from '@/components/icons/icons'
import { SectionMoreLink } from '@/components/layout/sections/more-link'
import {
  type PortfolioState,
  portfolioCatalog,
  statePath,
} from '@/lib/ai/chat/catalog'
import { cn } from '@/lib/utils'
import { eyebrow } from '../class-names'
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

function ProjectItemCard({ slug }: { slug: string }) {
  const project = usePortfolioState('projects', slug)
  return project ? (
    <WorkCard
      description={project.description}
      image={project.image}
      title={project.title}
      url={project.url}
    />
  ) : null
}

function PostItemRow({ slug }: { slug: string }) {
  const post = usePortfolioState('posts', slug)
  if (!post) {
    return null
  }
  // TODO(slopradar): duplicate-shape: catalog PostItem is PostRowPost flattened with an ISO date, so every row rebuilds the nested { data, url } shape; have the tool ship PostRowPost's shape (date as string) and convert only the date here
  const { url, ...data } = post
  return (
    <PostRow
      meta={false}
      post={{ data: { ...data, date: new Date(data.date) }, url }}
    />
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

// Each catalog entry renders the site's own component from the data the tool
// resolved on the server, so the model only ever picks which items to show
const { registry } = defineRegistry(portfolioCatalog, {
  components: {
    Experience: ({ props }) => <ExperienceItems ids={props.ids} />,
    MoreLink: ({ props }) => (
      <SectionMoreLink href={props.href}>{props.label}</SectionMoreLink>
    ),
    Post: ({ props }) => <PostItemRow slug={props.slug} />,
    Project: ({ props }) => <ProjectItemCard slug={props.slug} />,
    Stack: ({ children, props }) => (
      <StackGroup title={props.title}>{children}</StackGroup>
    ),
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
