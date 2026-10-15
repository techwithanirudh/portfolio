/**
 * A small sleeping Shih Tzu, drawn for this variant: curled body with a
 * plumed tail, head on the paws, a droopy ear, fringe over a closed eye,
 * a top-knot with a bow, and floating z's.
 */
export function SimbaSleeping({ className }: { className?: string }) {
  const ink = {
    stroke: 'var(--text)',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 2,
  }
  return (
    <svg aria-hidden className={className} fill='none' viewBox='0 0 160 104'>
      <ellipse cx='82' cy='92' fill='var(--panel-raised)' rx='72' ry='9' />
      <g className='vs-breathe'>
        {/* tail plume */}
        <path
          d='M126 60c6-14 22-16 26-6 3 8-4 14-11 12-5-1-6-6-3-8'
          fill='var(--panel)'
          {...ink}
        />
        {/* body */}
        <path
          d='M44 88c-6-24 14-42 46-42 30 0 52 14 50 42Z'
          fill='var(--panel)'
          {...ink}
        />
        {/* fur along the back */}
        <path
          d='M70 52c3 4 3 9 1 13M90 49c3 5 3 10 1 15M110 53c3 4 4 9 2 14M126 63c2 4 2 8 0 12'
          stroke='var(--muted)'
          strokeLinecap='round'
          strokeWidth='1.5'
        />
      </g>
      {/* head */}
      <path
        d='M16 78c-4-16 6-30 22-31 16-1 28 10 27 24-1 10-8 17-19 17H26c-6 0-9-4-10-10Z'
        fill='var(--panel)'
        {...ink}
      />
      {/* droopy ear */}
      <path
        d='M50 52c11 3 15 17 11 30-2 6-9 7-11 1-3-9-4-20 0-31Z'
        fill='var(--panel-raised)'
        {...ink}
      />
      <path
        d='M53 62c2 5 3 11 2 16'
        stroke='var(--muted)'
        strokeLinecap='round'
        strokeWidth='1.5'
      />
      {/* fringe and closed eye */}
      <path d='M22 64c5-6 15-7 22-2' {...ink} strokeWidth={1.75} />
      <path d='M28 70c2 2 6 2 8 0' {...ink} />
      {/* muzzle and nose */}
      <path d='M14 80c2 4 8 5 13 3' {...ink} strokeWidth={1.75} />
      <ellipse cx='15' cy='76' fill='var(--text)' rx='3.2' ry='2.6' />
      {/* top-knot and bow */}
      <path d='M34 48c-3-6 1-11 6-9 2-5 9-4 8 2' {...ink} strokeWidth={1.75} />
      <path
        d='M38 44l-5-4v8Zm4 0l5-4v8Z'
        fill='var(--accent)'
        stroke='var(--accent)'
        strokeLinejoin='round'
        strokeWidth='1'
      />
      {/* paws */}
      <path
        d='M22 89c0-5 4-7 9-7s9 2 9 7M42 89c0-5 4-7 8-7s8 2 8 7'
        fill='var(--panel)'
        {...ink}
      />
      {/* z's */}
      <g
        fill='var(--muted)'
        fontFamily='var(--font-geist-mono), monospace'
        fontWeight='600'
      >
        <text className='vs-zzz' fontSize='11' x='62' y='38'>
          z
        </text>
        <text className='vs-zzz' fontSize='14' x='72' y='26'>
          z
        </text>
        <text className='vs-zzz' fontSize='17' x='84' y='13'>
          Z
        </text>
      </g>
    </svg>
  )
}
