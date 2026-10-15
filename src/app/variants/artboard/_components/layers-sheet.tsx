'use client'

import { Layers, Moon, PenTool, SquareDashed, Sun, X } from 'lucide-react'
import { Dialog } from 'radix-ui'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { LayersTree } from './layers-panel'
import { useThemeToggle } from './toolbar'
import { useWorkspace } from './workspace'

function SheetToggle({
  icon: Icon,
  label,
  onClick,
  pressed,
}: {
  icon: typeof Layers
  label: string
  onClick: () => void
  pressed?: boolean
}) {
  return (
    <button
      aria-pressed={pressed}
      className={cn(
        'flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md text-[12px] shadow-[inset_0_0_0_1px_var(--panel-line)]',
        pressed && 'bg-(--sel) text-(--sel-ink) shadow-none'
      )}
      onClick={onClick}
      type='button'
    >
      <Icon aria-hidden className='size-3.5' strokeWidth={1.75} />
      {label}
    </button>
  )
}

/**
 * Below the desktop breakpoint the Layers panel becomes a bottom sheet,
 * with the toolbar's toggles at its foot.
 */
export function LayersSheet() {
  const [open, setOpen] = useState(false)
  const { outline, pen, setOutline, setPen } = useWorkspace()
  const { dark, toggle } = useThemeToggle()

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger asChild>
        <button
          aria-label='Open layers'
          className='ab-tool lg:hidden'
          type='button'
        >
          <Layers aria-hidden className='size-4' strokeWidth={1.75} />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/30 data-[state=closed]:animate-out data-[state=open]:animate-in' />
        <Dialog.Content
          aria-describedby={undefined}
          className='v-artboard data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom fixed inset-x-0 bottom-0 z-50 flex max-h-[78svh] min-h-0 flex-col rounded-t-2xl border-(--panel-line) border-t bg-(--panel) pb-[env(safe-area-inset-bottom)] data-[state=closed]:animate-out data-[state=open]:animate-in'
          style={{ minHeight: 0 }}
        >
          <div className='flex items-center justify-between border-(--panel-line) border-b px-4 py-3'>
            <span
              aria-hidden
              className='absolute top-1.5 left-1/2 h-1 w-9 -translate-x-1/2 rounded-full bg-(--panel-line)'
            />
            <Dialog.Title className='font-semibold text-[13px]'>
              Layers
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                aria-label='Close layers'
                className='ab-tool'
                type='button'
              >
                <X aria-hidden className='size-4' />
              </button>
            </Dialog.Close>
          </div>
          <div className='min-h-0 flex-1 overflow-y-auto'>
            <LayersTree onPick={() => setOpen(false)} />
          </div>
          <div className='flex gap-2 border-(--panel-line) border-t p-3'>
            <SheetToggle
              icon={SquareDashed}
              label='Outline'
              onClick={() => setOutline((v) => !v)}
              pressed={outline}
            />
            <SheetToggle
              icon={PenTool}
              label='Handles'
              onClick={() => setPen((v) => !v)}
              pressed={pen}
            />
            <SheetToggle
              icon={dark ? Sun : Moon}
              label={dark ? 'Light' : 'Dark'}
              onClick={toggle}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
