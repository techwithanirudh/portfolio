import { cn } from '@/lib/utils'

/**
 * "CHECKED: SIMBA". A rubber stamp in redline, slightly rotated, with a paw
 * for a signature. The rough edge comes from a turbulence displacement plus a
 * speckle mask, so it reads as ink rather than a vector badge.
 */
export function SimbaStamp({
  className,
  date,
}: {
  className?: string
  date: string
}) {
  return (
    <svg
      aria-label={`Checked by Simba, ${date}`}
      className={cn('ds-stamp h-auto w-[132px] -rotate-[7deg]', className)}
      role='img'
      viewBox='0 0 132 62'
    >
      <defs>
        <filter
          height='130%'
          id='ds-stamp-rough'
          width='130%'
          x='-15%'
          y='-15%'
        >
          <feTurbulence
            baseFrequency='0.9'
            numOctaves='2'
            result='noise'
            seed='7'
            type='fractalNoise'
          />
          <feDisplacementMap
            in='SourceGraphic'
            in2='noise'
            scale='1.6'
            xChannelSelector='R'
            yChannelSelector='G'
          />
        </filter>
        <filter id='ds-stamp-speckle'>
          <feTurbulence
            baseFrequency='1.4'
            numOctaves='1'
            seed='3'
            type='fractalNoise'
          />
          <feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -5 3.4' />
        </filter>
        <mask id='ds-stamp-mask'>
          <rect
            fill='white'
            filter='url(#ds-stamp-speckle)'
            height='62'
            width='132'
          />
        </mask>
      </defs>
      <g
        fill='none'
        filter='url(#ds-stamp-rough)'
        mask='url(#ds-stamp-mask)'
        stroke='currentColor'
      >
        <rect height='56' rx='5' strokeWidth='2.2' width='126' x='3' y='3' />
        <rect height='48' rx='2.5' strokeWidth='0.8' width='118' x='7' y='7' />
        <line strokeWidth='0.8' x1='42' x2='42' y1='7' y2='55' />
        {/* Paw: pad and four toes */}
        <g fill='currentColor' stroke='none'>
          <ellipse cx='24.5' cy='35' rx='7' ry='5.8' />
          <ellipse
            cx='15.5'
            cy='26'
            rx='2.6'
            ry='3.3'
            transform='rotate(-20 15.5 26)'
          />
          <ellipse
            cx='21.5'
            cy='20.5'
            rx='2.6'
            ry='3.4'
            transform='rotate(-6 21.5 20.5)'
          />
          <ellipse
            cx='28.5'
            cy='20.5'
            rx='2.6'
            ry='3.4'
            transform='rotate(8 28.5 20.5)'
          />
          <ellipse
            cx='34'
            cy='26'
            rx='2.6'
            ry='3.3'
            transform='rotate(22 34 26)'
          />
        </g>
        <g
          fill='currentColor'
          fontFamily='var(--font-geist-mono), ui-monospace, monospace'
          stroke='none'
        >
          <text fontSize='7.5' letterSpacing='1.6' x='50' y='19'>
            CHECKED
          </text>
          <text fontSize='17' fontWeight='700' letterSpacing='1' x='49' y='38'>
            SIMBA
          </text>
          <text fontSize='6.5' letterSpacing='0.8' x='50' y='49'>
            {date}
          </text>
        </g>
      </g>
    </svg>
  )
}
