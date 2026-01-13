import Link from 'next/link'
import { ViewTransition } from 'react'
import Balancer from 'react-wrap-balancer'
import { BlurImage } from '@/components/blur-image'

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
      className='group flex h-full flex-col gap-4 bg-card/50 p-6 transition-colors hover:bg-card/80'
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
          <ViewTransition name={transitionName} share='via-blur'>
            <h2 className='font-medium text-lg md:text-xl'>{title}</h2>
          </ViewTransition>
          <p className='line-clamp-3 text-muted-foreground text-sm'>
            <Balancer>{description}</Balancer>
          </p>
        </div>
        <span className='inline-flex items-center gap-2 text-muted-foreground text-sm transition-colors group-hover:text-foreground'>
          View case study
          <span aria-hidden='true'>→</span>
        </span>
      </div>
    </Link>
  )
}
