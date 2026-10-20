import { getImageProps } from 'next/image'
import type { CSSProperties } from 'react'
import { preload } from 'react-dom'
import { IMAGE_QUALITY } from '@/components/blur-image'

export const PROJECT_COVER_SIZES = '(min-width: 768px) 960px, 100vw'

/** Warms the case study's cover while the pointer or focus is on a link to it */
export const preloadCover = (src: string, alt: string) => {
  const { props } = getImageProps({
    alt,
    fill: true,
    quality: IMAGE_QUALITY,
    sizes: PROJECT_COVER_SIZES,
    src,
  })
  preload(props.src, {
    as: 'image',
    imageSizes: props.sizes,
    imageSrcSet: props.srcSet,
  })
}

export interface CoverCrop {
  x: number
  y: number
  zoom: number
}

/** Scales the cover about a focus point, so a full-window screenshot reads at thumbnail size */
export const coverCropStyle = (crop?: CoverCrop): CSSProperties | undefined =>
  crop
    ? {
        scale: crop.zoom,
        transformOrigin: `${crop.x}% ${crop.y}%`,
      }
    : undefined
