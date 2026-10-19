'use client'

import Link from 'next/link'
import { type ReactNode, ViewTransition } from 'react'
import { BlurImage } from '@/components/blur-image'
import { Icons } from '@/components/icons/icons'
import { preloadCover } from './cover'
import { projectTransitionName, projectTransitionShare } from './transition'

interface ProjectCardProps {
  description: string
  image?: string | null
  priority?: boolean
  title: string
  /** Left out where the card can sit beside the page's own copy, since two transitions can't share a name */
  transitionName?: string
  url: string
}

const SharedTransition = ({
  children,
  name,
}: {
  children: ReactNode
  name: string | undefined
}) =>
  name ? (
    <ViewTransition name={name} share={projectTransitionShare}>
      {children}
    </ViewTransition>
  ) : (
    children
  )

export const ProjectCard = ({
  title,
  description,
  image,
  priority = false,
  transitionName,
  url,
}: ProjectCardProps) => {
  const sharedName = (part: Parameters<typeof projectTransitionName>[1]) =>
    transitionName && projectTransitionName(transitionName, part)

  return (
    <Link
      className='group flex h-full flex-col gap-4 bg-card/60 p-6 transition-colors hover:bg-card'
      href={url}
      onFocus={() => image && preloadCover(image, title)}
      onPointerEnter={() => image && preloadCover(image, title)}
      transitionTypes={['project-card']}
    >
      {image && (
        <SharedTransition name={sharedName('image')}>
          <BlurImage
            alt={title}
            blur={false}
            className='relative aspect-video w-full overflow-hidden rounded-lg bg-background outline outline-black/10 -outline-offset-1 transition-transform group-hover:scale-102 dark:outline-white/10'
            fill
            imageClassName='object-cover'
            loading={priority ? 'eager' : 'lazy'}
            sizes='(min-width: 768px) 50vw, 100vw'
            src={image}
          />
        </SharedTransition>
      )}
      <div className='flex flex-1 flex-col gap-3'>
        <div className='flex flex-1 flex-col gap-2'>
          <SharedTransition name={sharedName('title')}>
            <h2 className='font-medium text-lg md:text-xl'>{title}</h2>
          </SharedTransition>
          <SharedTransition name={sharedName('description')}>
            <p className='line-clamp-3 text-pretty text-muted-foreground text-sm'>
              {description}
            </p>
          </SharedTransition>
        </div>
        <span className='inline-flex items-center gap-2 text-muted-foreground text-sm transition-colors group-hover:text-foreground'>
          View case study
          <Icons.arrowRight className='icon-arrow size-4' />
        </span>
      </div>
    </Link>
  )
}
