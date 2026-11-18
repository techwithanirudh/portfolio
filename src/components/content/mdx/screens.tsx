import { ImageZoom, Lightbox } from 'fumadocs-ui/components/image-zoom'
import type { CSSProperties, ReactNode } from 'react'
import { BlurImage } from '@/components/blur-image'
import { cn } from '@/lib/utils'

export function Screens({ children }: { children: ReactNode }) {
  return (
    <Lightbox>
      <div className='not-prose my-8 flex flex-wrap justify-center gap-3 sm:gap-5'>
        {children}
      </div>
    </Lightbox>
  )
}

export function Screen({
  alt,
  caption,
  height,
  src,
  width,
}: {
  alt: string
  caption?: string
  height: number
  src: string
  width: number
}) {
  const ratio = width / height
  const radius = ratio < 0.6 ? 'rounded-3xl' : 'rounded-lg'

  return (
    <figure
      className='min-w-0 max-w-[calc(var(--ratio)*36rem)] grow-(--ratio) basis-[calc(var(--ratio)*8rem)]'
      style={{ '--ratio': ratio.toFixed(3) } as CSSProperties}
    >
      <ImageZoom
        alt={alt}
        caption={caption}
        height={height}
        src={src}
        width={width}
        zoomInProps={{ className: radius }}
      >
        <BlurImage
          alt={alt}
          className={cn(
            'relative aspect-(--ratio) w-full bg-card outline outline-black/10 -outline-offset-1 dark:outline-white/10',
            radius
          )}
          fill
          imageClassName={cn('object-cover', radius)}
          sizes='(min-width: 768px) 480px, 100vw'
          src={src}
        />
      </ImageZoom>
      {caption && (
        <figcaption className='mt-3 text-pretty text-muted-foreground text-sm'>
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
