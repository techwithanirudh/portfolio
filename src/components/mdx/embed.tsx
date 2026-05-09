import { ImageZoom } from 'fumadocs-ui/components/image-zoom'
import type { ImageProps } from 'next/image'
import Image from 'next/image'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function IframeEmbed({ className, ...props }: ComponentProps<'iframe'>) {
  return (
    <div className='relative my-[1.25em]'>
      <iframe
        className={cn('aspect-video w-full rounded-xl', className)}
        {...props}
      />
      <div className='pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10 ring-inset dark:ring-white/10' />
    </div>
  )
}

export function FramedImage({
  canZoom = true,
  alt = '',
  src,
  className,
  height,
  width,
  ...props
}: ComponentProps<'img'> & { canZoom?: boolean }) {
  if (!src) {
    return null
  }

  return (
    <figure className='relative my-[1.25em] [&_img]:rounded-xl'>
      {canZoom ? (
        <ImageZoom
          alt={alt}
          className={className}
          height={(height as ImageProps['height']) ?? 630}
          src={src as string}
          width={(width as ImageProps['width']) ?? 1200}
          {...(props as object)}
        />
      ) : (
        <Image
          alt={alt}
          className={className}
          height={(height as ImageProps['height']) ?? 630}
          src={src as ImageProps['src']}
          width={(width as ImageProps['width']) ?? 1200}
          {...props}
        />
      )}
      <div className='pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10 ring-inset dark:ring-white/10' />
    </figure>
  )
}
