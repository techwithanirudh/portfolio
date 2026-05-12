import Link from 'next/link'
import { ViewTransition } from 'react'
import { BlurImage } from '@/components/blur-image'
import { Icons } from '@/components/icons/icons'

interface WorkCardProps {
  description: string
  image?: string | null
  slugs: string[]
  title: string
  url: string
}

const transition = { default: 'none', 'work-card': 'via-blur' } as const

export const WorkCard = ({
  title,
  description,
  image,
  url,
  slugs,
}: WorkCardProps) => {
  const transitionName = slugs.join('/')

  return (
    <Link
      className='group flex h-full flex-col gap-4 bg-card/60 p-6 transition-colors hover:bg-card'
      href={url}
      transitionTypes={['work-card']}
    >
      {image && (
        <ViewTransition name={`${transitionName}-image`} share={transition}>
          <BlurImage
            alt={title}
            className='relative aspect-video w-full overflow-hidden rounded-lg bg-background transition-transform will-change-transform group-hover:scale-102'
            fill
            imageClassName='object-cover'
            sizes='(min-width: 768px) 50vw, 100vw'
            src={image}
          />
        </ViewTransition>
      )}
      <div className='flex flex-1 flex-col gap-3'>
        <div className='flex flex-1 flex-col gap-2'>
          <ViewTransition name={`${transitionName}-title`} share={transition}>
            <h2 className='font-medium text-lg md:text-xl'>{title}</h2>
          </ViewTransition>
          <ViewTransition
            name={`${transitionName}-description`}
            share={transition}
          >
            <p className='line-clamp-3 text-pretty text-muted-foreground text-sm'>
              {description}
            </p>
          </ViewTransition>
        </div>
        <span className='inline-flex items-center gap-2 text-muted-foreground text-sm transition-colors group-hover:text-foreground'>
          View case study
          <Icons.arrowRight className='icon-arrow size-4' />
        </span>
      </div>
    </Link>
  )
}
