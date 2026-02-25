'use client'

import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import { cn } from '@/lib/utils'
import { useSelectionContextMenu } from './hooks/use-selection-context-menu'

export const SelectionContextMenu = ({
  label = 'Ask Simba',
  onSelect,
}: {
  label?: string
  onSelect: (selection: string) => void
}) => {
  const { selection, clearSelection } = useSelectionContextMenu()

  if (!selection) {
    return null
  }

  return (
    <button
      className={cn(
        buttonVariants({
          color: 'primary',
          size: 'sm',
          className:
            'fixed z-[70] -translate-x-1/2 -translate-y-full rounded-md border border-dashed shadow-lg',
        })
      )}
      onClick={() => {
        onSelect(selection.text)
        clearSelection()
      }}
      style={{
        left: selection.x,
        top: selection.y,
      }}
      type='button'
    >
      {label}
    </button>
  )
}
