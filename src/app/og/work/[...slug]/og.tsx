import type { ImageResponseOptions } from '@takumi-rs/image-response'
import type { ReactElement } from 'react'

interface GenerateProps {
  backgroundImage?: string | null
  description?: string
  title: string
}

export function getImageResponseOptions(): ImageResponseOptions {
  return {
    format: 'webp',
    height: 630,
    width: 1200,
  }
}

export function generate({
  title,
  description = 'Learn more about this work by visiting the website.',
}: GenerateProps): ReactElement {
  return (
    <div
      style={{ fontFamily: 'Geist Sans' }}
      tw='flex h-full w-full bg-black text-white'
    >
      <div tw='flex border absolute border-stone-900 border-dashed inset-y-0 left-16 w-[1px]' />
      <div tw='flex border absolute border-stone-900 border-dashed inset-y-0 right-16 w-[1px]' />
      <div tw='flex border absolute border-stone-900 inset-x-0 h-[1px] top-16' />
      <div tw='flex border absolute border-stone-900 inset-x-0 h-[1px] bottom-16' />
      <div tw='flex flex-col justify-end items-start absolute inset-24 gap-4'>
        <span tw='text-[22px] font-bold uppercase text-stone-500 ml-1'>
          Work
        </span>
        <div
          style={{
            fontSize: title && title.length > 20 ? 64 : 80,
            fontWeight: 600,
            letterSpacing: '-0.04em',
            textWrap: 'balance',
          }}
          tw='tracking-tight flex flex-col justify-center leading-[1.1]'
        >
          {title}
        </div>
        <div
          style={{
            fontWeight: 500,
            maxHeight: '120px',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textWrap: 'pretty',
          }}
          tw='max-w-full text-[38px] leading-[1.5] text-stone-400'
        >
          {description}
        </div>
      </div>
    </div>
  )
}
