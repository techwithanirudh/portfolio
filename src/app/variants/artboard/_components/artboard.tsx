import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ArtboardLabel } from './artboard-label'

/**
 * A section drawn as an artboard: a white frame on the canvas with its name
 * and live size above the top-left corner, like a frame in a vector tool.
 */
export function Artboard({
  children,
  className,
  frameClassName,
  hiddenLayers,
  id,
  name,
  page,
}: {
  children: ReactNode
  className?: string
  frameClassName?: string
  /** Count of hidden layers, shown in the label as a hint. */
  hiddenLayers?: number
  id: string
  name: string
  page: string
}) {
  return (
    <section
      aria-label={name}
      className={cn('ab-artboard', className)}
      data-artboard={id}
      data-layer={name}
      data-layer-type='group'
      id={id}
    >
      <ArtboardLabel
        hiddenLayers={hiddenLayers}
        id={id}
        name={name}
        page={page}
      />
      <div className={cn('ab-frame', frameClassName)} data-frame={id}>
        {children}
      </div>
    </section>
  )
}

/** The mono caption that sits inside a frame, like a layer note. */
export function FrameCaption({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p className={cn('ab-t-label text-(--muted)', className)}>{children}</p>
  )
}
