import Link from 'next/link'
import { ViewTransition } from 'react'
import Balancer from 'react-wrap-balancer'
import { BlurImage } from '@/components/blur-image'
import { Icons } from '@/components/icons/icons'

interface WorkCardProps {
  title: string
  description: string
  image?: string | null
  url: string
  slugs: string[]
}

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
    >
      {image && (
        <ViewTransition name={`${transitionName}-image`} share='via-blur'>
          <BlurImage
            alt={title}
            className='relative aspect-video w-full overflow-hidden rounded-lg bg-background transition-transform group-hover:scale-102'
            fill
            imageClassName='object-cover'
            sizes='(min-width: 768px) 50vw, 100vw'
            src={image}
          />
        </ViewTransition>
      )}
      <div className='flex flex-1 flex-col gap-3'>
        <div className='flex flex-1 flex-col gap-2'>
          <ViewTransition name={`${transitionName}-title`} share='via-blur'>
            <h2 className='font-medium text-lg md:text-xl'>{title}</h2>
          </ViewTransition>
          <ViewTransition
            name={`${transitionName}-description`}
            share='via-blur'
          >
            <p className='line-clamp-3 text-muted-foreground text-sm'>
              <Balancer>{description}</Balancer>
            </p>
          </ViewTransition>
        </div>
        <span className='inline-flex items-center gap-2 text-muted-foreground text-sm transition-colors group-hover:text-foreground'>
          View case study
          <Icons.arrowRight className='size-4 transition-transform group-hover:-rotate-45' />
        </span>
      </div>
    </Link>
  )
}
