'use client'

import { useId, useMemo, useRef } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'
import { POSES, type Pose, type PoseName } from './constants'
import { RIG_DEFS, SPRITES } from './rig-art'
import { useLook } from './use-look'
import { useReadingEyes } from './use-reading-eyes'
import { useSpriteFrames } from './use-sprite-frames'

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
/** Mirrors a sprite around the ground point at x 69 */
const FLIP = 'matrix(-1 0 0 1 138 0)'

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
  /** Skips following the pointer and the idle loop, for small static copies */
  still?: boolean
  /** Crop into the drawing's coordinates, e.g. just the head */
  view?: RigView
}) {
  const ref = useRef<SVGSVGElement>(null)
  const reducedMotion = useReducedMotion()
  const prefix = `simba${useId().replaceAll(/[^\w-]/g, '')}-`
  const defs = useMemo(() => scopeIds(RIG_DEFS, prefix), [prefix])

  const current: Pose = POSES[pose]
  const staged = 'hidden' in current ? null : current
  const hidden = !staged
  const animate = !(still || reducedMotion)
  const { chest, pop, shown, soft } = useSpriteFrames(
    staged && { flip: staged.flip ?? false, sprite: staged.sprite },
    {
      animate,
      settle: staged?.settle ?? false,
      talking: staged?.talking ?? false,
    }
  )
  const reading = !hidden && shown.sprite === 'books'
  useLook(ref, !(still || reading))
  useReadingEyes(ref, { reading, scan: animate })
  const motion = animate ? staged?.motion : undefined
  const sprite = useMemo(
    () => scopeIds(SPRITES[shown.sprite], prefix),
    [prefix, shown.sprite]
  )

  return (
    <svg
      aria-hidden
      className={cn('simba-rig', className)}
      data-chest={chest || undefined}
      data-hidden={hidden || undefined}
      data-motion={motion}
      overflow='visible'
      ref={ref}
      style={{ aspectRatio: `${view.width} / ${view.height}`, height: size }}
      viewBox={`${view.x} ${view.y} ${view.width} ${view.height}`}
    >
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static artwork bundled with the site */}
      <defs dangerouslySetInnerHTML={{ __html: defs }} />
      <g className='simba-root'>
        <g className='simba-pop' data-soft={soft || undefined} key={pop}>
          <ellipse
            cx='69'
            cy='220'
            fill={`url(#${prefix}ground)`}
            rx='62'
            ry='8'
          />
          <g
            className='simba-body'
            // biome-ignore lint/security/noDangerouslySetInnerHtml: static artwork bundled with the site
            dangerouslySetInnerHTML={{ __html: sprite }}
            transform={shown.flip ? FLIP : undefined}
          />
        </g>
      </g>
    </svg>
  )
}
