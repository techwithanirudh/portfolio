import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { PhotoSlot } from './notes'
import { tilt } from './notes'

/**
 * A photo, or a labelled slot for one, with a white border, a handwritten
 * caption and a strip of tape. The tilt comes from its index so server and
 * client always agree.
 */
export function TapedPhoto({
  aspect = '4 / 5',
  className,
  index = 0,
  priority = false,
  sizes = '(min-width: 1024px) 280px, 80vw',
  slot,
  tape = 'top',
  tiltScale = 1,
}: {
  aspect?: string
  className?: string
  index?: number
  priority?: boolean
  sizes?: string
  slot: PhotoSlot
  tape?: 'top' | 'corners' | 'none'
  tiltScale?: number
}) {
  const degrees = tilt(index, tiltScale)
  return (
    <figure
      className={cn('fn-photo fn-tape', className)}
      data-tape={tape}
      style={
        {
          '--fn-tape-tilt': `${-degrees * 0.8}deg`,
          transform: `rotate(${degrees}deg)`,
        } as React.CSSProperties
      }
    >
      <div
        className='relative w-full overflow-hidden'
        style={{ aspectRatio: aspect }}
      >
        {slot.kind === 'image' ? (
          <Image
            alt={slot.alt}
            className='object-cover'
            fill
            priority={priority}
            sizes={sizes}
            src={slot.src}
          />
        ) : (
          <div className='fn-placeholder absolute inset-0 grid place-items-center p-2 text-center sm:p-4'>
            <span className='font-mono text-[9.5px] leading-snug tracking-[0.02em] sm:text-[11px]'>
              {slot.label}
            </span>
          </div>
        )}
      </div>
      <figcaption className='fn-hand px-0.5 pt-1 pb-1.5 text-center text-[1.05rem] text-[var(--fn-photo-ink)] leading-tight sm:px-1 sm:pt-1.5 sm:pb-2 sm:text-[1.3rem]'>
        {slot.caption}
      </figcaption>
    </figure>
  )
}
