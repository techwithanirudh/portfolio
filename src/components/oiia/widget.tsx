'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Icons } from '@/components/icons/icons'
import { useOiiaMode } from './provider'

export function OiiaWidget() {
  const { mode, catCount, clearAll, disable } = useOiiaMode()

  return (
    <AnimatePresence>
      {mode === 'oiia' && (
        <div className='fixed inset-x-0 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-[10000] flex justify-center px-4'>
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className='flex w-full max-w-xs flex-col overflow-hidden rounded-2xl border bg-background/80 shadow-lg backdrop-blur-md sm:w-auto'
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ damping: 30, stiffness: 400, type: 'spring' }}
          >
            <p className='select-none px-4 py-2 text-center text-muted-foreground text-xs'>
              collide two cats to spawn a new one
            </p>

            <div className='grid grid-cols-3 divide-x border-t'>
              <div className='flex items-center justify-center gap-1.5 py-2'>
                <span aria-label='cat' className='text-base' role='img'>
                  🐱
                </span>
                <motion.span
                  animate={{ scale: [1, 1.4, 1] }}
                  className='min-w-[1.5rem] text-center font-mono font-semibold text-foreground text-sm tabular-nums'
                  key={catCount}
                  transition={{ duration: 0.25, ease: 'backOut' }}
                >
                  {catCount}
                </motion.span>
              </div>

              <button
                aria-label='Clear all OIIA cats'
                className='flex items-center justify-center gap-1 py-2 font-medium text-muted-foreground text-xs transition-colors hover:bg-accent hover:text-accent-foreground'
                onClick={clearAll}
                type='button'
              >
                <span>🎉</span>
                <span>Clear</span>
              </button>

              <button
                aria-label='Disable OIIA mode'
                className='flex items-center justify-center py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground'
                onClick={disable}
                type='button'
              >
                <Icons.close className='size-3.5' />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
