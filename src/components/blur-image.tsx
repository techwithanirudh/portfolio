'use client'
import NextImage from 'next/image'
import { useCallback, useState } from 'react'
/**
 * Copyright (c) Delba de Oliveira
 * Source: https://github.com/delbaoliveira/website/blob/59e6f181ad75751342ceaa8931db4cbcef86b018/ui/BlurImage.tsx
 */
import { cn } from '@/lib/utils'

export const IMAGE_QUALITY = 85

type ImageProps = {
  /** Set to false for shared-element transitions so the snapshot is never blurred. */
  blur?: boolean
  imageClassName?: string
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
          'transition-[filter,scale] duration-700 ease-in-out motion-reduce:transition-none',
          isLoading && 'scale-[1.02] blur-xl grayscale',
          imageClassName
        )}
        loading={lazy ? 'lazy' : undefined}
        onLoad={() => setLoaded(true)}
        priority={!lazy}
        quality={IMAGE_QUALITY}
        ref={imageRef}
        src={src}
        {...rest}
      />
    </div>
  )
}

export { BlurImage }
