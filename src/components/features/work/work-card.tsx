'use client'

import { getImageProps } from 'next/image'
import Link from 'next/link'
import { type ReactNode, ViewTransition } from 'react'
import { preload } from 'react-dom'
import { BlurImage, IMAGE_QUALITY } from '@/components/blur-image'
import { Icons } from '@/components/icons/icons'
import { WORK_COVER_SIZES } from './cover'

// TODO(slopradar): duplicate-type: description/image/slugs/title/url restate ProjectItem in lib/ai/chat/catalog.ts, and work-grid.tsx and render-portfolio.ts each map a WorkPage into it (description ?? '', image ?? null); define the card data once and one toWorkCard(page) mapper
interface WorkCardProps {
  description: string
  image?: string | null
  priority?: boolean
  title: string
  /**
   * The shared view transition name, left out where the same card can sit
   * beside the page's own copy (Simba's panel), since two transitions can't
   * share a name
   */
  transitionName?: string
  url: string
}

const transition = { default: 'none', 'work-card': 'via-blur' } as const

const SharedTransition = ({
  children,
  name,
}: {
  children: ReactNode
  name: string | undefined
}) =>
  name ? (
    <ViewTransition name={name} share={transition}>
      {children}
    </ViewTransition>
  ) : (
    children
  )

const preloadCover = (src: string, alt: string) => {
  const { props } = getImageProps({
    alt,
    fill: true,
    quality: IMAGE_QUALITY,
    sizes: WORK_COVER_SIZES,
    src,
  })
  preload(props.src, {
    as: 'image',
    imageSizes: props.sizes,
    imageSrcSet: props.srcSet,
  })
}

export const WorkCard = ({
  title,
  description,
  image,
  priority = false,
  transitionName,
  url,
}: WorkCardProps) => {
  const sharedName = (part: string) =>
    transitionName && `${transitionName}-${part}`

  return (
    <Link
      className='group flex h-full flex-col gap-4 bg-card/60 p-6 transition-colors hover:bg-card'
      href={url}
      onFocus={() => image && preloadCover(image, title)}
      onPointerEnter={() => image && preloadCover(image, title)}
      transitionTypes={['work-card']}
    >
      {image && (
        <SharedTransition name={sharedName('image')}>
          <BlurImage
            alt={title}
            blur={false}
            className='relative aspect-video w-full overflow-hidden rounded-lg bg-background outline outline-black/10 -outline-offset-1 transition-transform group-hover:scale-102 dark:outline-white/10'
            fill
            imageClassName='object-cover'
            lazy={!priority}
            // TODO(slopradar): magic-string: sizes assumes two columns from md, but WorkGrid splits at lg by default (columnsFrom) and Simba's panel shows the card at about 360px, so it over-fetches; take sizes from the caller (or derive it from columnsFrom)
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
