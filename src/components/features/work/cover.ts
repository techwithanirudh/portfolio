import { getImageProps } from 'next/image'
import { preload } from 'react-dom'
import { IMAGE_QUALITY } from '@/components/blur-image'

export const WORK_COVER_SIZES = '(min-width: 1024px) 1200px, 100vw'

/** Warms the case study's cover while the pointer or focus is on a link to it */
export const preloadCover = (src: string, alt: string) => {
  const { props } = getImageProps({
    alt,
    fill: true,
    quality: IMAGE_QUALITY,
    sizes: WORK_COVER_SIZES,
    src,
  })
  preload(props.src, {
    as: 'image',
    imageSizes: props.sizes,
    imageSrcSet: props.srcSet,
  })
}
