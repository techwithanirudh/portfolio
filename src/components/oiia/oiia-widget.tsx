'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useOiiaMode } from './oiia-provider'

export function OiiaWidget() {
  const { mode, catCount, requestClearAll, disableOiia } = useOiiaMode()

  return (
    <AnimatePresence>
      {mode === 'oiia' && (
        <motion.div
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className='fixed bottom-5 left-1/2 z-[10000] flex -translate-x-1/2 flex-col items-center gap-1.5'
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          {/* Tip */}
          <p className='flex select-none items-center gap-2 rounded-full border border-black/10 bg-white/75 p-1.5 text-xs text-black/70 backdrop-blur-xl dark:border-white/20 dark:bg-black/60 dark:text-white/70'>
            make two collide to spawn a new oiia
          </p>

          {/* Controls pill */}
          <div className='flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-2 shadow-2xl backdrop-blur-xl'>
            {/* Count */}
            <div className='flex items-center gap-1.5'>
              <span aria-label='cat' className='text-base' role='img'>
                🐱
              </span>
              <motion.span
                animate={{ scale: [1, 1.4, 1] }}
                className='min-w-[1.5rem] text-center font-bold font-mono text-sm text-white tabular-nums'
                key={catCount}
                transition={{ duration: 0.25, ease: 'backOut' }}
              >
                {catCount}
              </motion.span>
            </div>

            <div className='h-4 w-px bg-white/25' />

            <button
              aria-label='Clear all OIIA cats'
              className='flex items-center gap-1 rounded-full px-2 py-0.5 font-medium text-white/70 text-xs transition-all hover:scale-110 hover:bg-white/15 hover:text-white active:scale-95'
              onClick={requestClearAll}
              type='button'
            >
              <span>🎉</span>
              <span>Clear</span>
            </button>

            <div className='h-4 w-px bg-white/25' />

            <button
              aria-label='Disable OIIA mode'
              className='rounded-full px-2 py-0.5 font-medium text-white/40 text-xs transition-all hover:scale-110 hover:bg-white/15 hover:text-white/80 active:scale-95'
              onClick={disableOiia}
              type='button'
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
