'use client'

import { useId, useMemo, useRef } from 'react'
import { cn } from '@/lib/utils'
import { POSES, type PoseName } from './constants'
import { RIG_ART } from './rig-art'
import { useLook } from './use-look'

// Each instance gets its own ids, so a hidden copy can't take the gradients
// down with it
const scopeIds = (art: string, prefix: string) =>
  art
    .replaceAll('id="', `id="${prefix}`)
    .replaceAll('href="#', `href="#${prefix}`)
    .replaceAll('url(#', `url(#${prefix}`)

export interface RigView {
  height: number
  width: number
  x: number
  y: number
}

const VIEW: RigView = { height: 200, width: 154, x: -8, y: 30 }
const SEAT = 'translate(12 129) scale(.99 .92)'
const muzzles = ['neutral', 'smile', 'surprise'] as const
const ears = [
  { id: 'earLeft', side: 'left' },
  { id: 'earRight', side: 'right' },
] as const

export function SimbaRig({
  className,
  pose,
  size = 100,
  still = false,
  view = VIEW,
}: {
  className?: string
  pose: PoseName
  /** Height as px, or any CSS length; the width follows the drawing */
  size?: number | string
  /** Skips following the pointer, for small static copies */
  still?: boolean
  /** Crop into the drawing's coordinates, e.g. just the head */
  view?: RigView
}) {
  const ref = useRef<SVGSVGElement>(null)
  useLook(ref, !still)
  const prefix = `simba${useId().replaceAll(/[^\w-]/g, '')}-`
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
      // The standing pose's tail reaches past the frame
      overflow='visible'
      ref={ref}
      style={{ aspectRatio: `${view.width} / ${view.height}`, height: size }}
      viewBox={`${view.x} ${view.y} ${view.width} ${view.height}`}
    >
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static artwork bundled with the site */}
      <defs dangerouslySetInnerHTML={{ __html: art }} />
      <g className='simba-root'>
        <g className='simba-pop' key={full ?? 'rig'}>
          <ellipse
            cx='69'
            cy='220'
            fill={`url(${href('ground')})`}
            rx='60'
            ry='6.2'
          />
          {full ? (
            <g className='simba-body'>
              <use href={href(`pose-${full}`)} />
            </g>
          ) : (
            <>
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
              </g>
              <g
                className='simba-head'
                style={{
                  transform: `translate(${rig.shift ?? 0}px, ${rig.lift ?? 0}px) rotate(${rig.head}deg)`,
                }}
              >
                <g className='simba-tilt'>
                  <g transform='translate(6 47) scale(1.02 .96)'>
                    {ears.map(({ id, side }) => (
                      <g
                        className={`simba-ear simba-ear-${side}`}
                        key={id}
                        style={{ rotate: `${-rig.head * 0.25}deg` }}
                      >
                        <g className='simba-ear-lag'>
                          <g className='simba-ear-twitch'>
                            <use href={href(id)} />
                          </g>
                        </g>
                      </g>
                    ))}
                    <use href={href('headFace')} />
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
              {/* Drawn over the head so the waving paw sits in front of the
                  cheek and ear, not tucked behind them */}
              <g className='simba-body'>
                <g className='simba-fade' opacity={rig.paw ? 1 : 0}>
                  <g className='simba-paw'>
                    <use href={href('paw-up')} transform='translate(12 120)' />
                  </g>
                </g>
              </g>
            </>
          )}
        </g>
      </g>
    </svg>
  )
}
