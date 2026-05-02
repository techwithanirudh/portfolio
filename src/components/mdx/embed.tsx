import { ImageZoom } from 'fumadocs-ui/components/image-zoom'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function IframeEmbed({ className, ...props }: ComponentProps<'iframe'>) {
  return (
    <div className='relative my-[1.25em]'>
      <iframe className={cn('aspect-video w-full rounded-xl', className)} {...props} />
      <div className='pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10 ring-inset dark:ring-white/10' />
    </div>
  )
}

export function FramedImage({
  canZoom = true,
  alt = '',
  src,
  className,
  ...props
}: ComponentProps<'img'> & { canZoom?: boolean }) {
  return (
    <figure className='relative my-[1.25em] [&_img]:rounded-xl'>
      {canZoom && src ? (
        <ImageZoom alt={alt} src={src as string} {...(props as object)} />
      ) : (
        <img alt={alt} className={className} src={src} {...props} />
      )}
      <div className='pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10 ring-inset dark:ring-white/10' />
    </figure>
  )
}
