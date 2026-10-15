'use client'

import { useEffect, useRef } from 'react'
import { Selectable } from './selectable'
import type { SelectionInfo } from './selection'
import { useWorkspace } from './workspace'

/*
 * Simba, the site's Shih Tzu, as a simple line drawing made for this
 * variant. Paths use absolute M / C / L / Z only, so their anchor points can
 * be read straight from the data and drawn in outline mode.
 */
const K = 0.5523

const circle = (cx: number, cy: number, r: number) => {
  const k = r * K
  return [
    `M${cx} ${cy - r}`,
    `C${cx + k} ${cy - r} ${cx + r} ${cy - k} ${cx + r} ${cy}`,
    `C${cx + r} ${cy + k} ${cx + k} ${cy + r} ${cx} ${cy + r}`,
    `C${cx - k} ${cy + r} ${cx - r} ${cy + k} ${cx - r} ${cy}`,
    `C${cx - r} ${cy - k} ${cx - k} ${cy - r} ${cx} ${cy - r}Z`,
  ].join(' ')
}

const SIMBA_PATHS = {
  bow: 'M80 14 L70 8 L70 20 Z M80 14 L90 8 L90 20 Z',
  // Long, droopy ears.
  earL: 'M50 42 C36 40 24 54 22 72 C20 92 26 110 38 114 C46 116 50 106 48 96 C46 86 44 74 46 64',
  earR: 'M110 42 C124 40 136 54 138 72 C140 92 134 110 122 114 C114 116 110 106 112 96 C114 86 116 74 114 64',
  // Fluffy head: a soft, slightly wide oval with a fringe dip at the top.
  head: 'M80 30 C92 24 106 30 112 42 C122 52 124 70 118 86 C112 102 98 112 80 112 C62 112 48 102 42 86 C36 70 38 52 48 42 C54 30 68 24 80 30 Z',
  // The top knot and its bow.
  knot: 'M72 30 C70 20 74 12 80 10 C86 12 90 20 88 30',
  mouth: 'M80 85 C80 90 76 93 72 92 M80 85 C80 90 84 93 88 92',
  // Muzzle fur, nose and mouth.
  muzzle:
    'M64 82 C64 72 72 68 80 68 C88 68 96 72 96 82 C96 94 88 100 80 100 C72 100 64 94 64 82 Z',
  nose: 'M74 78 C74 74 86 74 86 78 C86 82 82 85 80 85 C78 85 74 82 74 78 Z',
  tongue: 'M77 93 C77 98 83 98 83 93',
} as const

const EYES = [circle(64, 62, 4.5), circle(96, 62, 4.5)]

const NUMBER_SEP = /[\s,]+/
// cspell:ignore MLCZ
const COMMANDS = /[MLCZ][^MLCZ]*/g

/** Endpoints of every segment: the anchor points a pen tool would show. */
function anchorsOf(d: string) {
  const points: [number, number][] = []
  for (const cmd of d.match(COMMANDS) ?? []) {
    const nums = cmd
      .slice(1)
      .trim()
      .split(NUMBER_SEP)
      .filter(Boolean)
      .map(Number)
    if (nums.length >= 2) {
      points.push([nums.at(-2) as number, nums.at(-1) as number])
    }
  }
  return points
}

const ANCHORS = [...Object.values(SIMBA_PATHS), ...EYES].flatMap(anchorsOf)

export function SimbaDrawing({ className }: { className?: string }) {
  return (
    <svg
      aria-label='Simba, a Shih Tzu, drawn as line art'
      className={className}
      role='img'
      viewBox='14 2 132 120'
    >
      {Object.entries(SIMBA_PATHS).map(([name, d]) => (
        <path d={d} key={name} />
      ))}
      {EYES.map((d) => (
        <path className='ab-simba-fill' d={d} key={d} />
      ))}
      <g aria-hidden className='ab-simba-anchors'>
        {ANCHORS.map(([x, y], i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: anchors are static
          <rect height='3' key={i} width='3' x={x - 1.5} y={y - 1.5} />
        ))}
      </g>
    </svg>
  )
}

/**
 * The hidden "simba.svg" layer on the Contact artboard. Selecting it in the
 * Layers panel (or the "1 hidden layer" hint) reveals and selects it.
 */
export function SimbaLayer({ info }: { info: SelectionInfo }) {
  const { select, selection, simba } = useWorkspace()
  const revealed = useRef(false)

  useEffect(() => {
    if (!simba || revealed.current) {
      return
    }
    revealed.current = true
    const el = document.querySelector<HTMLElement>('[data-select-id="simba"]')
    if (el && selection?.info.id !== 'simba') {
      select(info, el)
      const reduce = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
      el.scrollIntoView({
        behavior: reduce ? 'auto' : 'smooth',
        block: 'center',
      })
    }
  }, [info, select, selection, simba])

  return (
    <Selectable className='w-36 text-(--ink)' hidden={!simba} info={info}>
      <SimbaDrawing className='ab-simba block w-full' />
      <p className='ab-t-label mt-1 text-center text-(--muted)'>
        {ANCHORS.length} anchor points
      </p>
    </Selectable>
  )
}
