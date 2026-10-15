'use client'

import { useId, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { fullPoses, POSES, type PoseName } from './constants'
import { RIG_ART } from './rig-art'

// Each instance gets its own ids, so a hidden copy can't take the gradients
// down with it
const scopeIds = (art: string, prefix: string) =>
  art
    .replaceAll('id="', `id="${prefix}`)
    .replaceAll('href="#', `href="#${prefix}`)
    .replaceAll('url(#', `url(#${prefix}`)

const VIEW = { height: 200, width: 154, x: -8, y: 30 }
const SEAT = 'translate(12 129) scale(.99 .92)'
const muzzles = ['neutral', 'smile', 'surprise'] as const

export function SimbaRig({
  className,
  pose,
  size = 100,
}: {
  className?: string
  pose: PoseName
  size?: number
}) {
  const prefix = `simba${useId().replaceAll(':', '')}-`
  const art = useMemo(() => scopeIds(RIG_ART, prefix), [prefix])
  const href = (id: string) => `#${prefix}${id}`

  const current = POSES[pose]
  const hidden = 'hidden' in current
  const full = 'full' in current ? current.full : null
  const rig = 'head' in current ? current : { head: 0 }
  const muzzle = rig.muzzle ?? 'neutral'

  return (
    <svg
      aria-hidden
      className={cn('simba-rig', className)}
      data-hidden={hidden || undefined}
      height={size}
      viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.width} ${VIEW.height}`}
      width={(size * VIEW.width) / VIEW.height}
    >
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static artwork bundled with the site */}
      <defs dangerouslySetInnerHTML={{ __html: art }} />
      <g className='simba-root'>
        <ellipse
          cx='69'
          cy='220'
          fill={`url(${href('ground')})`}
          rx='60'
          ry='6.2'
        />
        <g className='simba-fade' opacity={full ? 0 : 1}>
          <g className='simba-body'>
            <g transform={SEAT}>
              <use href={href('sitTorso')} />
              <use
                className='simba-fade'
                href={href('frontLegL')}
                opacity={rig.paw ? 0 : 1}
              />
              <use href={href('frontLegR')} />
              <use href={href('bib')} />
            </g>
            <g className='simba-fade' opacity={rig.paw ? 1 : 0}>
              <g className='simba-paw'>
                <use href={href('paw-up')} transform='translate(12 120)' />
              </g>
            </g>
          </g>
          <g
            className='simba-head'
            style={{
              transform: `translate(${rig.shift ?? 0}px, ${rig.lift ?? 0}px) rotate(${rig.head}deg)`,
            }}
          >
            <g transform='translate(6 47) scale(1.02 .96)'>
              <use href={href('headBase')} />
              <use href={href('brows')} />
              <use href={href('crown')} />
              <g className='simba-eye'>
                <use
                  href={href('eye')}
                  transform='rotate(5 43 53)'
                  x='35'
                  y='45'
                />
              </g>
              <g className='simba-eye'>
                <use
                  href={href('eye')}
                  transform='rotate(-8 79 54)'
                  x='71'
                  y='46'
                />
              </g>
              <path
                d='m34 46c4-4 11-3 15 1m23 0c3-3 9-3 13 1'
                fill='none'
                opacity='.6'
                stroke='#755f47'
                strokeWidth='1.3'
              />
              {muzzles.map((name) => (
                <use
                  className='simba-fade'
                  href={href(`${name}Muzzle`)}
                  key={name}
                  opacity={name === muzzle ? 1 : 0}
                />
              ))}
            </g>
          </g>
        </g>
        {fullPoses.map((name) => (
          <use
            className='simba-fade'
            href={href(`pose-${name}`)}
            key={name}
            opacity={name === full ? 1 : 0}
          />
        ))}
      </g>
    </svg>
  )
}
