import { ImageZoom, Lightbox } from 'fumadocs-ui/components/image-zoom'
import type { ReactNode } from 'react'
import { BlurImage } from '@/components/blur-image'
import { cn } from '@/lib/utils'

/** `phone` is a tall rounded frame for app screens, `wide` a 16:9 frame for desktop and web screenshots */
type ScreenFrame = 'phone' | 'wide'

const frames = {
  phone: {
    aspect: 'aspect-[390/844] rounded-3xl',
    height: 844,
    radius: 'rounded-3xl',
    sizes: '(min-width: 768px) 360px, 50vw',
    width: 390,
  },
  wide: {
    aspect: 'aspect-video rounded-lg',
    height: 630,
    radius: 'rounded-lg',
    sizes: '(min-width: 768px) 480px, 50vw',
    width: 1200,
  },
} satisfies Record<ScreenFrame, Record<string, number | string>>

/** Screens from one story, two to a row (or one when `columns` is 1), that open in a shared viewer */
export function Screens({
  children,
  columns = 2,
}: {
  children: ReactNode
  columns?: 1 | 2
}) {
  return (
    <Lightbox>
      <div
        className={cn(
          'not-prose my-8 grid gap-3 sm:gap-5',
          columns === 1 ? 'grid-cols-1' : 'grid-cols-2'
        )}
      >
        {children}
      </div>
    </Lightbox>
  )
}

export function Screen({
  alt,
  caption,
  fit = 'cover',
  frame = 'phone',
  src,
}: {
  alt: string
  caption?: string
  /** `contain` shows the whole image when its shape differs from the frame, such as a diagram */
  fit?: 'contain' | 'cover'
  frame?: ScreenFrame
  src: string
}) {
  const { aspect, height, radius, sizes, width } = frames[frame]

  return (
    <figure>
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
            'relative w-full bg-card outline outline-black/10 -outline-offset-1 dark:outline-white/10',
            aspect
          )}
          fill
          imageClassName={cn(
            fit === 'contain' ? 'object-contain' : 'object-cover',
            radius
          )}
          sizes={sizes}
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
