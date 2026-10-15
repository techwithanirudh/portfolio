'use client'

import { type RefObject, useEffect, useState } from 'react'

/** Live, rounded border-box size of an element, like a W × H readout. */
export function useElementSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ height: 0, width: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) {
      return
    }
    const observer = new ResizeObserver(([entry]) => {
      const box = entry?.borderBoxSize?.[0]
      const width = Math.round(box?.inlineSize ?? el.offsetWidth)
      const height = Math.round(box?.blockSize ?? el.offsetHeight)
      setSize((prev) =>
        prev.width === width && prev.height === height
          ? prev
          : { height, width }
      )
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return size
}
