import { ImageZoom } from 'fumadocs-ui/components/image-zoom'
import type { ImageProps } from 'next/image'
import Image from 'next/image'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

const FrameOutline = () => (
  <div className='pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10 ring-inset dark:ring-white/10' />
)

export function IframeEmbed({
  className,
  title,
  ...props
}: ComponentProps<'iframe'> & { title: string }) {
  return (
    <div className='relative my-[1.25em]'>
      <iframe
        className={cn('aspect-video w-full rounded-xl', className)}
        title={title}
        {...props}
      />
      <FrameOutline />
    </div>
  )
}

export type FramedImageProps = Omit<
  ImageProps,
  'alt' | 'height' | 'src' | 'width'
> &
  Partial<Pick<ImageProps, 'alt' | 'height' | 'src' | 'width'>> & {
    canZoom?: boolean
  }

export function FramedImage({
  canZoom = true,
  alt = '',
  src,
  className,
  height = 630,
  width = 1200,
  ...props
}: FramedImageProps) {
  if (!src) {
    return null
  }

  return (
    <figure className='relative my-[1.25em] [&_img]:rounded-xl'>
      {canZoom ? (
        <ImageZoom
          alt={alt}
          className={className}
          height={height}
          src={src}
          width={width}
          {...props}
        />
      ) : (
        <Image
          alt={alt}
          className={className}
          height={height}
          src={src}
          width={width}
          {...props}
        />
      )}
      <FrameOutline />
    </figure>
  )
}
