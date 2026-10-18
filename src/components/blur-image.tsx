'use client'
import NextImage from 'next/image'
import { useCallback, useState } from 'react'
// TODO(slopradar): attribution: the Delba de Oliveira header sits between imports and the source is missing from THIRD_PARTY_NOTICES.md, move it under 'use client' above the imports and add the notice
/**
 * Copyright (c) Delba de Oliveira
 * Source: https://github.com/delbaoliveira/website/blob/59e6f181ad75751342ceaa8931db4cbcef86b018/ui/BlurImage.tsx
 */
import { cn } from '@/lib/utils'

export const IMAGE_QUALITY = 85

type ImageProps = {
  blur?: boolean
  imageClassName?: string
  // TODO(slopradar): boolean-prop: `lazy` duplicates next/image's own `loading` prop, accept `loading` and derive fetchPriority from loading === 'eager'
  lazy?: boolean
} & React.ComponentProps<typeof NextImage>

const BlurImage = (props: ImageProps) => {
  const {
    alt,
    src,
    className,
    imageClassName,
    blur = true,
    lazy = true,
    ...rest
  } = props
  const [loaded, setLoaded] = useState(false)
  const isLoading = blur && !loaded

  // Images served from cache can finish loading before hydration, so onLoad never fires.
  const imageRef = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) {
      setLoaded(true)
    }
  }, [])

  return (
    <div
      className={cn('overflow-hidden', isLoading && 'animate-pulse', className)}
    >
      <NextImage
        alt={alt}
        className={cn(
          'transition-[filter,scale] duration-400 ease-out-strong motion-reduce:transition-none',
          isLoading && 'scale-[1.02] blur-lg grayscale',
          imageClassName
        )}
        // `priority` is deprecated; eager plus high fetch priority covers
        // above the fold images without preloading every LCP candidate
        fetchPriority={lazy ? undefined : 'high'}
        loading={lazy ? 'lazy' : 'eager'}
        onLoad={() => setLoaded(true)}
        quality={IMAGE_QUALITY}
        ref={imageRef}
        src={src}
        {...rest}
      />
    </div>
  )
}

export { BlurImage }
