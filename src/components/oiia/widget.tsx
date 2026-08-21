'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Icons } from '@/components/icons/icons'
import { useOiiaMode } from './provider'

export function OiiaWidget() {
  const { mode, catCount, clearAll, disable } = useOiiaMode()

  return (
    <AnimatePresence>
      {mode === 'oiia' && (
        <div className='fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[10000] flex justify-center'>
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className='flex items-center gap-0.5 rounded-full border bg-background/80 px-1.5 py-1.5 shadow-lg backdrop-blur-md'
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ damping: 30, stiffness: 400, type: 'spring' }}
          >
            <div className='flex h-8 items-center gap-1.5 rounded-full px-2.5 text-primary'>
              <Icons.pawPrint className='size-4' />
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                className='min-w-[1ch] text-center font-semibold text-sm tabular-nums'
                key={catCount}
                transition={{ duration: 0.25, ease: 'backOut' }}
              >
                {catCount}
              </motion.span>
            </div>

            <div className='mx-1 h-4 w-px bg-border' />

            <button
              aria-label='Clear all OIIA cats'
              className='flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
              onClick={clearAll}
              type='button'
            >
              <Icons.eraser className='size-4' />
            </button>

            <div className='mx-1 h-4 w-px bg-border' />

            <button
              aria-label='Disable OIIA mode'
              className='flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
              onClick={disable}
              type='button'
            >
              <Icons.close className='size-4' />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
