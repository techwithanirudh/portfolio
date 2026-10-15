import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * An image layer. In outline mode the picture hides and the frame shows a
 * crossed box, the way vector tools draw image fills.
 */
export function ImageFrame({
  alt,
  className,
  layer,
  priority,
  sizes,
  src,
}: {
  alt: string
  className?: string
  layer: string
  priority?: boolean
  sizes: string
  src: string
}) {
  return (
    <span
      className={cn('ab-img', className)}
      data-layer={layer}
      data-layer-type='image'
    >
      <Image
        alt={alt}
        className='object-cover'
        fetchPriority={priority ? 'high' : undefined}
        fill
        loading={priority ? 'eager' : undefined}
        sizes={sizes}
        src={src}
      />
    </span>
  )
}

/**
 * A clearly labelled empty image frame for something Anirudh would need to
 * supply, e.g. `[photo: Lego Mindstorms, 2018]`.
 */
export function Placeholder({
  className,
  label,
}: {
  className?: string
  label: string
}) {
  return (
    <span
      className={cn('ab-placeholder', className)}
      data-layer={`[${label}]`}
      data-layer-type='image'
    >
      <span className='ab-t-label m-2 rounded-sm bg-(--board) px-1.5 py-0.5 text-(--muted)'>
        [{label}]
      </span>
    </span>
  )
}
