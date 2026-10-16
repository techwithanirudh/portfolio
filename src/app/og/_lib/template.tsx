import type { ReactElement } from 'react'

export const ogImageSize = { height: 630, width: 1200 }

export function OgGrid({ border }: { border: string }): ReactElement {
  return (
    <>
      <div
        tw={`flex border absolute ${border} border-dashed inset-y-0 left-16 w-[1px]`}
      />
      <div
        tw={`flex border absolute ${border} border-dashed inset-y-0 right-16 w-[1px]`}
      />
      <div tw={`flex border absolute ${border} inset-x-0 h-[1px] top-16`} />
      <div tw={`flex border absolute ${border} inset-x-0 h-[1px] bottom-16`} />
    </>
  )
}

interface PageImageProps {
  backgroundImage?: string | null
  description: string
  label: string
  title: string
}

export function PageImage({
  backgroundImage,
  description,
  label,
  title,
}: PageImageProps): ReactElement {
  return (
    <div
      style={{ fontFamily: 'Geist Sans' }}
      tw='flex h-full w-full bg-black text-white relative'
    >
      {backgroundImage && (
        <>
          <div
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
            tw='absolute inset-0'
          />
          <div tw='absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-black/10' />
          <div tw='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />
        </>
      )}
      <OgGrid
        border={backgroundImage ? 'border-white/20' : 'border-stone-900'}
      />
      <div tw='flex flex-col justify-end items-start absolute inset-24 gap-4'>
        <span
          tw={`text-[22px] font-bold uppercase ml-1 ${backgroundImage ? 'text-stone-200' : 'text-stone-500'}`}
        >
          {label}
        </span>
        <div
          style={{
            fontSize: title.length > 20 ? 64 : 80,
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
          tw={`max-w-full text-[38px] leading-[1.5] ${backgroundImage ? 'text-white/70' : 'text-stone-400'}`}
        >
          {description}
        </div>
      </div>
    </div>
  )
}
