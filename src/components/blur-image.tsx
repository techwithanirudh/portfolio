'use client'

/**
 * Copyright (c) Delba de Oliveira
 * Source: https://github.com/delbaoliveira/website/blob/59e6f181ad75751342ceaa8931db4cbcef86b018/ui/BlurImage.tsx
 */
import NextImage from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export const IMAGE_QUALITY = 85

type ImageProps = {
  blur?: boolean
  imageClassName?: string
} & React.ComponentProps<typeof NextImage>

const BlurImage = (props: ImageProps) => {
  const {
    alt,
    src,
    className,
    imageClassName,
    blur = true,
    loading = 'lazy',
    ...rest
  } = props
  const [loaded, setLoaded] = useState(false)
  const isLoading = blur && !loaded

  return (
    <div
      className={cn('overflow-hidden', isLoading && 'animate-pulse', className)}
    >
      <NextImage
        alt={alt}
        className={cn(
          'transition-[filter,scale] duration-400 ease-out-strong',
          isLoading && 'scale-[1.02] blur-lg grayscale',
          imageClassName
        )}
        loading={loading}
        onLoad={() => setLoaded(true)}
        quality={IMAGE_QUALITY}
        src={src}
        {...rest}
      />
    </div>
  )
}

export { BlurImage }
