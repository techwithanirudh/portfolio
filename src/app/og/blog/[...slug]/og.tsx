import type { ImageResponseOptions } from '@takumi-rs/image-response'
import type { ReactElement } from 'react'

interface GenerateProps {
  title: string
  description?: string
}

export function getImageResponseOptions(): ImageResponseOptions {
  return {
    format: 'webp',
    width: 1200,
    height: 630,
  }
}

export function generate({
  title,
  description = 'Learn more about this post by visiting the website.',
}: GenerateProps): ReactElement {
  return (
    <div
      tw="flex h-full w-full bg-black text-white"
      style={{ fontFamily: "Geist Sans" }}
    >
      <div tw="flex border absolute border-stone-900 border-dashed inset-y-0 left-16 w-[1px]" />
      <div tw="flex border absolute border-stone-900 border-dashed inset-y-0 right-16 w-[1px]" />
      <div tw="flex border absolute border-stone-900 inset-x-0 h-[1px] top-16" />
      <div tw="flex border absolute border-stone-900 inset-x-0 h-[1px] bottom-16" />
      <div tw="flex flex-col absolute w-[896px] justify-center inset-32 gap-4">
        <span tw="text-[22px] font-bold uppercase text-stone-500 ml-1">
          Blog
        </span>
        <div
          tw="tracking-tight flex flex-col justify-center leading-[1.1]"
          style={{
            textWrap: "balance",
            fontWeight: 600,
            fontSize: title && title.length > 20 ? 64 : 80,
            letterSpacing: "-0.04em",
          }}
        >
          {title}
        </div>
        <div
          tw="text-[40px] leading-[1.5] text-stone-400 h-[120px] overflow-hidden truncate"
          style={{
            fontWeight: 500,
          }}
        >
          {description}
        </div>
      </div>
    </div>
  )
}