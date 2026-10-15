import type { ReactElement } from 'react'
import { OgGrid } from '@/app/og/_lib/template'

interface GenerateProps {
  subtitle?: string
  title?: string
}

function CodeIcon({ ...props }): ReactElement {
  return (
    <svg
      fill='none'
      height='48'
      stroke='#a8a29e'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      viewBox='0 0 24 24'
      width='48'
      {...props}
    >
      <polyline points='16 18 22 12 16 6' />
      <polyline points='8 6 2 12 8 18' />
    </svg>
  )
}

function getTitleSize(title?: string): number {
  const length = title?.length ?? 0
  if (length > 80) {
    return 48
  }
  if (length > 40) {
    return 56
  }
  return length > 20 ? 64 : 80
}

export function generate({
  title = 'John Doe',
  subtitle,
}: GenerateProps): ReactElement {
  const hasSubtitle = Boolean(subtitle && subtitle.length > 0)

  return (
    <div
      style={{ fontFamily: 'Geist Sans' }}
      tw='flex h-full w-full bg-black text-white'
    >
      <OgGrid border='border-stone-900' />
      <CodeIcon tw='absolute top-22 right-23' />
      <div tw='flex flex-col absolute w-[896px] justify-end inset-24 items-start'>
        <div
          style={{
            fontSize: getTitleSize(title),
            fontWeight: 600,
            letterSpacing: '-0.04em',
            textWrap: 'balance',
          }}
          tw='tracking-tight flex flex-col justify-center leading-[1.1]'
        >
          {title}
        </div>
        {hasSubtitle && (
          <div
            style={{
              fontWeight: 500,
              maxHeight: '120px',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textWrap: 'pretty',
            }}
            tw='mt-4 max-w-full text-[38px] leading-[1.5] text-stone-400'
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  )
}
