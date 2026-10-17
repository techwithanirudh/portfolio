'use client'

import {
  defineRegistry,
  JSONUIProvider,
  Renderer,
  useStateValue,
} from '@json-render/react'
import type { ReactNode } from 'react'
import { Shimmer } from '@/components/ai-elements/shimmer'
import { PostRow } from '@/components/features/blog/post-row'
import { ExperienceTimeline, WorkCard } from '@/components/features/work'
import { Icons } from '@/components/icons/icons'
import { SectionMoreLink } from '@/components/layout/sections/more-link'
import {
  type PortfolioState,
  type PostItem,
  type ProjectItem,
  portfolioCatalog,
  statePath,
} from '@/lib/ai/chat/catalog'
import type { MyUIMessage } from '@/lib/ai/chat/types'

type PortfolioToolPart = Extract<
  MyUIMessage['parts'][number],
  { type: 'tool-renderPortfolio' }
>

function StackGroup({
  children,
  title,
}: {
  children?: ReactNode
  title: string | null
}) {
  return (
    <section className='dashed-stack'>
      {title && (
        <h3 className='px-3 py-2 font-medium text-[11px] text-muted-foreground uppercase tracking-wide'>
          {title}
        </h3>
      )}
      {children}
    </section>
  )
}

function ProjectItemCard({ slug }: { slug: string }) {
  const project = useStateValue<ProjectItem>(statePath('projects', slug))
  return project ? <WorkCard {...project} viewTransition={false} /> : null
}

function PostItemRow({ slug }: { slug: string }) {
  const post = useStateValue<PostItem>(statePath('posts', slug))
  if (!post) {
    return null
  }
  const { url, ...data } = post
  return (
    <PostRow
      meta={false}
      post={{ data: { ...data, date: new Date(data.date) }, url }}
    />
  )
}

function ExperienceItems({ ids }: { ids: string[] }) {
  const experience = useStateValue<PortfolioState['experience']>('/experience')
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

export function PortfolioPart({ part }: { part: PortfolioToolPart }) {
  const output = part.state === 'output-available' ? part.output : null

  if (part.state === 'output-error' || output?.success === false) {
    return (
      <p className='flex items-center gap-2 text-muted-foreground text-xs'>
        <Icons.warning aria-hidden className='size-3.5' />
        couldn&apos;t fetch those
      </p>
    )
  }

  if (!output) {
    return (
      <p className='flex items-center gap-2 text-muted-foreground text-sm'>
        <Icons.work aria-hidden className='size-4 shrink-0' />
        <Shimmer>fetching the cards...</Shimmer>
      </p>
    )
  }

  return (
    // `data-narrow` keeps the site's components in their phone layout here
    <div
      className='not-prose overflow-hidden rounded-md border border-dashed'
      data-narrow
    >
      <JSONUIProvider initialState={output.spec.state} registry={registry}>
        <Renderer registry={registry} spec={output.spec} />
      </JSONUIProvider>
    </div>
  )
}
