'use client'

import { useCallback, useEffect, useState } from 'react'
import { useEventListener, useWindowSize } from 'usehooks-ts'

type SelectionData = {
  text: string
  x: number
  y: number
}

const ViewportPadding = 16

export const useSelectionContextMenu = ({
  maxChars = 1200,
}: {
  maxChars?: number
} = {}) => {
  const [selection, setSelection] = useState<SelectionData | null>(null)
  const { width: viewportWidth = 0 } = useWindowSize()

  const clearSelection = useCallback(() => {
    setSelection(null)
  }, [])

  useEventListener('scroll', clearSelection, undefined, { capture: true })
  useEventListener('resize', clearSelection)

  useEffect(() => {
    const handleSelectionChange = () => {
      const selected = window.getSelection()
      if (!(selected && selected.rangeCount > 0 && !selected.isCollapsed)) {
        clearSelection()
        return
      }

      const text = selected.toString().trim()
      if (text.length === 0) {
        clearSelection()
        return
      }

      const range = selected.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      if (rect.width === 0 && rect.height === 0) {
        clearSelection()
        return
      }

      const minX = ViewportPadding
      const maxX = Math.max(viewportWidth - ViewportPadding, minX)
      const x = Math.min(Math.max(rect.left + rect.width / 2, minX), maxX)
      const y = Math.max(rect.top - 10, ViewportPadding)

      setSelection({
        text: text.slice(0, maxChars),
        x,
        y,
      })
    }

    document.addEventListener('selectionchange', handleSelectionChange)
    return () =>
      document.removeEventListener('selectionchange', handleSelectionChange)
  }, [clearSelection, maxChars, viewportWidth])

  return {
    selection,
    clearSelection,
  }
}
