'use client'

import { EyeOff } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useElementSize } from './use-element-size'
import { useWorkspace } from './workspace'

/**
 * "Home / Hero — 880 × 640" above an artboard. The size is measured live;
 * clicking the label selects the frame, as it does in a design tool.
 */
export function ArtboardLabel({
  hiddenLayers,
  id,
  name,
  page,
}: {
  hiddenLayers?: number
  id: string
  name: string
  page: string
}) {
  const frame = useRef<HTMLElement | null>(null)
  const { select, setSimba, simba } = useWorkspace()

  useEffect(() => {
    frame.current = document.querySelector<HTMLElement>(`[data-frame="${id}"]`)
  }, [id])

  const { height, width } = useElementSize(frame)

  return (
    <div className='ab-label'>
      <button
        className='ab-label-name'
        onClick={() => {
          const el = document.querySelector<HTMLElement>(`[data-frame="${id}"]`)
          if (!el) {
            return
          }
          select(
            {
              fields: [
                { label: 'Page', value: page },
                { label: 'Artboard', value: name },
                {
                  label: 'Layers',
                  mono: true,
                  value: String(el.querySelectorAll('[data-layer]').length),
                },
              ],
              id: `frame:${id}`,
              kind: 'Artboard',
              name,
              type: 'frame',
            },
            el
          )
        }}
        type='button'
      >
        <span className='text-(--muted)'>{page} /</span> {name}
      </button>
      <span aria-hidden className='ab-label-size'>
        {width > 0 ? `${width} × ${height}` : ''}
      </span>
      {hiddenLayers && !simba ? (
        <button
          className='ab-label-hidden'
          onClick={() => setSimba(true)}
          type='button'
        >
          <EyeOff aria-hidden className='size-3' />
          {hiddenLayers} hidden layer
        </button>
      ) : null}
    </div>
  )
}
