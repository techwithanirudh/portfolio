'use client'

import Link from 'next/link'
import { useDeferredValue, useState, ViewTransition } from 'react'
import { BlurImage } from '@/components/blur-image'
import { Icons } from '@/components/icons/icons'
import { SearchRedirectInput } from '@/components/search-redirect-input'
import { ViewAnimation } from '@/components/view-animation'
import { staggerDelay } from '@/lib/stagger'
import { cn } from '@/lib/utils'
import { type CoverCrop, coverCropStyle } from './cover'
import { projectTransitionName, projectTransitionShare } from './transition'

export interface ProjectIndexItem {
  description: string
  github: boolean
  image: string | null
  imageCrop?: CoverCrop
  slug: string
  tags: string[]
  title: string
  url: string
  website: boolean
  year: number
}

const matches = (project: ProjectIndexItem, query: string) =>
  [project.title, project.description, ...project.tags].some((text) =>
    text.toLowerCase().includes(query)
  )

/** Every cover sits in the same tinted, hairline-framed 16:9 panel so uneven screenshots read as a set */
const Cover = ({
  className,
  project,
}: {
  className?: string
  project: ProjectIndexItem
}) => (
  <div
    className={cn(
      'relative aspect-video w-full overflow-hidden rounded-md bg-muted/60 outline outline-black/10 -outline-offset-1 dark:outline-white/10',
      className
    )}
  >
    {project.image && (
      <ViewTransition
        name={projectTransitionName(project.slug, 'image')}
        share={projectTransitionShare}
      >
        <BlurImage
          alt=''
          blur={false}
          className='absolute inset-0'
          fill
          imageClassName='object-cover'
          sizes='(min-width: 1024px) 480px, 100vw'
          src={project.image}
          style={coverCropStyle(project.imageCrop)}
        />
      </ViewTransition>
    )}
  </div>
)

const GridCard = ({ project }: { project: ProjectIndexItem }) => (
  <Link
    className='group flex h-full flex-col gap-4 bg-card/60 p-6 transition-colors hover:bg-card focus-visible:-outline-offset-2'
    href={project.url}
    transitionTypes={['project-card']}
  >
    <Cover project={project} />
    <div className='flex flex-1 flex-col gap-1'>
      <h2 className='font-medium text-lg'>{project.title}</h2>
      <p className='line-clamp-1 text-muted-foreground'>
        {project.description}
      </p>
    </div>
    <span className='flex items-center gap-2 text-muted-foreground text-sm'>
      {[String(project.year), ...project.tags.slice(0, 2)].join(' · ')}
      <Icons.arrowRight className='icon-arrow ml-auto size-4 transition-colors group-hover:text-foreground' />
    </span>
  </Link>
)

export const ProjectIndex = ({
  projects,
}: {
  projects: ProjectIndexItem[]
}) => {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query.trim().toLowerCase())
  const visible = deferredQuery
    ? projects.filter((project) => matches(project, deferredQuery))
    : projects

  return (
    <div className='border-t border-dashed'>
      <ViewAnimation>
        <SearchRedirectInput
          className='h-10 min-w-full rounded-none border-0 pl-1 shadow-none ring-inset'
          onValueChange={setQuery}
          placeholder='Search projects…'
          tag='projects'
        />
      </ViewAnimation>
      <div className='dashed-grid lg:dashed-grid-2 grid grid-cols-1 border-t border-dashed text-left lg:grid-cols-2'>
        {visible.map((project, index) => (
          <ViewAnimation delay={staggerDelay(index)} key={project.url}>
            <GridCard project={project} />
          </ViewAnimation>
        ))}
        {visible.length % 2 === 1 && (
          <div aria-hidden className='hidden bg-dashed lg:block' />
        )}
      </div>
      {visible.length === 0 && (
        <p className='border-t border-dashed px-6 py-8 text-muted-foreground'>
          No projects match that search.
        </p>
      )}
    </div>
  )
}
