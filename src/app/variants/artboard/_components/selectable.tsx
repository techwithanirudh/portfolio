'use client'

import { useRouter } from 'next/navigation'
import { type ReactNode, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { SelectionInfo } from './selection'
import { useElementSize } from './use-element-size'
import { useDefaultSelection, useWorkspace } from './workspace'

const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as const

/** The selection box: a 1px outline, eight square handles and a W × H pill. */
export function SelectionBox({
  height,
  width,
}: {
  height: number
  width: number
}) {
  return (
    <span aria-hidden className='ab-sel'>
      {HANDLES.map((h) => (
        <span className='ab-handle' data-h={h} key={h} />
      ))}
      <span className='ab-size'>
        {width} × {height}
      </span>
    </span>
  )
}

/**
 * Wraps a card so it behaves like a layer: hover or focus draws the
 * selection box, a click selects it into the Properties panel and a
 * double-click opens its link. Keyboard users get a real "Inspect" button.
 */
export function Selectable({
  children,
  className,
  hidden,
  info,
  isDefault,
  layer,
}: {
  children: ReactNode
  className?: string
  hidden?: boolean
  info: SelectionInfo
  /** Selected on page load on wide screens. */
  isDefault?: boolean
  /** Layer name in the Layers panel, defaults to the info name. */
  layer?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { registry, select } = useWorkspace()
  const { height, width } = useElementSize(ref)
  const router = useRouter()

  useEffect(() => {
    registry.set(info.id, info)
    return () => {
      registry.delete(info.id)
    }
  }, [info, registry])

  useDefaultSelection(isDefault ? info : undefined, ref)

  const pick = () => {
    if (ref.current) {
      select(info, ref.current)
    }
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: pointer shortcut; the Inspect button below is the keyboard path
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: same: the Inspect button is the keyboard path
    // biome-ignore lint/a11y/useKeyWithClickEvents: the Inspect button below is the keyboard path
    <div
      className={cn('ab-selectable', className)}
      data-layer={layer ?? info.name}
      data-layer-type={info.type}
      data-select-id={info.id}
      hidden={hidden}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest('a, button')) {
          return
        }
        pick()
      }}
      onDoubleClick={(event) => {
        if (!info.open || (event.target as HTMLElement).closest('a, button')) {
          return
        }
        if (info.open.startsWith('/')) {
          router.push(info.open)
        } else {
          window.open(info.open, '_blank', 'noopener')
        }
      }}
      ref={ref}
    >
      {children}
      <button className='ab-inspect' onClick={pick} type='button'>
        Inspect {info.name}
      </button>
      <SelectionBox height={height} width={width} />
    </div>
  )
}
