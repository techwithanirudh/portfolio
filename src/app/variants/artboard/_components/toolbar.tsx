'use client'

import {
  Frame,
  Hand,
  type LucideIcon,
  Moon,
  MousePointer2,
  PenTool,
  SquareDashed,
  Sun,
  Type,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useWorkspace } from './workspace'

function Tool({
  icon: Icon,
  keys,
  label,
  onClick,
  pressed,
}: {
  icon: LucideIcon
  keys?: string
  label: string
  onClick: () => void
  pressed?: boolean
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          aria-label={label}
          aria-pressed={pressed}
          className='ab-tool'
          onClick={onClick}
          type='button'
        >
          <Icon aria-hidden className='size-4' strokeWidth={1.75} />
        </button>
      </TooltipTrigger>
      <TooltipContent
        className='rounded px-2 py-1 font-mono text-[11px]'
        side='top'
        sideOffset={8}
      >
        {label}
        {keys ? <span className='ml-1 opacity-50'>{keys}</span> : null}
      </TooltipContent>
    </Tooltip>
  )
}

export function useThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const dark = mounted && resolvedTheme === 'dark'
  return { dark, toggle: () => setTheme(dark ? 'light' : 'dark') }
}

/**
 * The floating bottom toolbar. Move is the only real tool; Pen shows the
 * journey's Bézier handles; the rest are honest about being view-only.
 */
export function Toolbar() {
  const { outline, pen, setOutline, setPen } = useWorkspace()
  const { dark, toggle } = useThemeToggle()
  const [note, setNote] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const viewOnly = (tool: string) => {
    setNote(`${tool} is off: this file is view-only`)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setNote(null), 1800)
  }

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <div className='pointer-events-none fixed inset-x-0 bottom-4 z-40 hidden justify-center md:flex lg:pl-[240px] xl:pr-[260px]'>
      <div className='relative'>
        <p
          aria-live='polite'
          className={cn(
            'ab-t-label ab-float pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded px-2 py-1 text-(--muted) transition-opacity duration-100',
            note ? 'opacity-100' : 'opacity-0'
          )}
        >
          {note}
        </p>
        <div
          aria-label='Tools'
          className='ab-float pointer-events-auto flex items-center gap-0.5 rounded-xl p-1'
          role='toolbar'
        >
          <Tool
            icon={MousePointer2}
            keys='V'
            label='Move'
            onClick={() => setPen(false)}
            pressed={!pen}
          />
          <Tool
            icon={Frame}
            keys='F'
            label='Frame'
            onClick={() => viewOnly('Frame')}
          />
          <Tool
            icon={PenTool}
            keys='P'
            label='Pen: show path handles'
            onClick={() => setPen((v) => !v)}
            pressed={pen}
          />
          <Tool
            icon={Type}
            keys='T'
            label='Text'
            onClick={() => viewOnly('Text')}
          />
          <Tool
            icon={Hand}
            keys='H'
            label='Hand'
            onClick={() => viewOnly('Hand')}
          />
          <span aria-hidden className='mx-1 h-5 w-px bg-(--panel-line)' />
          <Tool
            icon={SquareDashed}
            keys='⌘Y'
            label='Outline mode'
            onClick={() => setOutline((v) => !v)}
            pressed={outline}
          />
          <Tool
            icon={dark ? Sun : Moon}
            label={dark ? 'Light theme' : 'Dark theme'}
            onClick={toggle}
          />
        </div>
      </div>
    </div>
  )
}
