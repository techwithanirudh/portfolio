'use client'

import { ArrowUpRight, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { layerIcons } from './layers-panel'
import { useWorkspace } from './workspace'

/**
 * Below the desktop breakpoint there is no Properties panel, so a tap on a
 * card opens this compact inspector instead.
 */
export function SelectionDock() {
  const { clear, selection, userSelected } = useWorkspace()
  const info = userSelected ? selection?.info : undefined
  const Icon = info ? layerIcons[info.type] : null

  return (
    <AnimatePresence>
      {info && Icon ? (
        <motion.aside
          animate={{ opacity: 1, y: 0 }}
          aria-label={`Properties: ${info.name}`}
          className='ab-float fixed inset-x-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-40 mx-auto max-w-md rounded-xl p-3 md:bottom-20 xl:hidden'
          exit={{ opacity: 0, y: 8 }}
          initial={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
        >
          <div className='flex items-start gap-2'>
            <Icon
              aria-hidden
              className={cn(
                'mt-0.5 size-4 flex-none',
                info.type === 'component'
                  ? 'text-(--component)'
                  : 'text-(--muted)'
              )}
              strokeWidth={1.75}
            />
            <div className='min-w-0 flex-1'>
              <p className='truncate font-semibold text-[13px] leading-5'>
                {info.name}
              </p>
              <p className='ab-t-label text-(--muted)'>{info.kind}</p>
            </div>
            <button
              aria-label='Deselect'
              className='ab-tool -m-1 size-7'
              onClick={clear}
              type='button'
            >
              <X aria-hidden className='size-4' />
            </button>
          </div>
          <dl className='mt-2 grid grid-cols-[56px_1fr] gap-x-2 gap-y-1 text-[12px] leading-4'>
            {info.fields
              .filter((f) => f.label !== 'About')
              .slice(0, 3)
              .map((field) => (
                <div className='contents' key={field.label}>
                  <dt className='ab-mono text-(--faint) text-[11px]'>
                    {field.label}
                  </dt>
                  <dd
                    className={cn('min-w-0 truncate', field.mono && 'ab-mono')}
                  >
                    {field.value}
                  </dd>
                </div>
              ))}
          </dl>
          {info.fills && info.fills.items.length > 0 ? (
            <p className='ab-t-label mt-2 truncate text-(--muted)'>
              {info.fills.label}: {info.fills.items.join(' · ')}
            </p>
          ) : null}
          {info.exports && info.exports.length > 0 ? (
            <div className='mt-3 flex flex-wrap gap-1.5'>
              {info.exports.slice(0, 3).map((item, i) => (
                <a
                  className={cn(
                    'ab-btn h-8 px-2.5 text-[12px]',
                    i === 0 ? 'ab-btn-primary' : 'ab-btn-ghost'
                  )}
                  href={item.href}
                  key={item.href}
                  rel={item.href.startsWith('http') ? 'noopener' : undefined}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                >
                  {item.hint}
                  <ArrowUpRight aria-hidden className='size-3.5' />
                </a>
              ))}
            </div>
          ) : null}
        </motion.aside>
      ) : null}
    </AnimatePresence>
  )
}
