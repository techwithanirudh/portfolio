'use client'

import { getImageProps } from 'next/image'
import Link from 'next/link'
import { ViewTransition } from 'react'
import { preload } from 'react-dom'
import { BlurImage, IMAGE_QUALITY } from '@/components/blur-image'
import { Icons } from '@/components/icons/icons'
import { WORK_COVER_SIZES } from './cover'

interface WorkCardProps {
  description: string
  image?: string | null
  /** Short mono labels under the description, such as the year. */
  meta?: string[]
  slugs: string[]
  title: string
  url: string
}

const transition = { default: 'none', 'work-card': 'via-blur' } as const

// The case study cover is requested at a larger size than the card's, so warm
// the exact srcset it will use and the shared-element morph lands on a loaded image.
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

// Flush, ruled project cell: edge to edge cover, mono title, one line of copy
export const WorkCard = ({
  title,
  description,
  image,
  meta = [],
  url,
  slugs,
}: WorkCardProps) => {
  const transitionName = slugs.join('/')

  return (
    <Link
      className='group flex h-full flex-col transition-colors duration-200 hover:bg-card/80'
      data-sound-hover
      href={url}
      onFocus={() => image && preloadCover(image, title)}
      onPointerEnter={() => image && preloadCover(image, title)}
      transitionTypes={['work-card']}
    >
      {image ? (
        <ViewTransition name={`${transitionName}-image`} share={transition}>
          <BlurImage
            alt={title}
            blur={false}
            className='relative aspect-video w-full border-line border-b bg-card/50'
            fill
            imageClassName='object-cover transition-[scale,filter] duration-500 ease-out will-change-transform group-hover:scale-[1.03] group-hover:brightness-100 motion-reduce:transition-none dark:brightness-[0.85]'
            sizes='(min-width: 768px) 50vw, 100vw'
            src={image}
          />
        </ViewTransition>
      ) : (
        <div className='aspect-video w-full border-line border-b bg-dashed' />
      )}
      <div className='flex flex-1 items-start gap-4 p-4'>
        <div className='flex min-w-0 flex-1 flex-col gap-1'>
          <ViewTransition name={`${transitionName}-title`} share={transition}>
            <h2 className='truncate font-heading font-medium text-base tracking-tight transition-colors group-hover:text-primary'>
              {title}
            </h2>
          </ViewTransition>
          <ViewTransition
            name={`${transitionName}-description`}
            share={transition}
          >
            <p className='line-clamp-1 text-muted-foreground text-sm'>
              {description}
            </p>
          </ViewTransition>
          {meta.length > 0 && (
            <p className='mt-1 font-mono text-muted-foreground text-xs tabular-nums'>
              {meta.join(' · ')}
            </p>
          )}
        </div>
        <Icons.arrowRight className='mt-0.5 size-4 shrink-0 text-muted-foreground transition-[rotate,translate,scale,color] duration-300 group-hover:-rotate-45 group-hover:text-foreground' />
      </div>
    </Link>
  )
}
