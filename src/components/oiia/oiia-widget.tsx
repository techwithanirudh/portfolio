'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useOiiaMode } from './oiia-provider'

export function OiiaWidget() {
  const { mode, catCount, requestClearAll, disableOiia } = useOiiaMode()
  const isOiia = mode === 'oiia'

  return (
    <AnimatePresence>
      {isOiia && (
        <motion.div
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className='fixed bottom-5 left-1/2 z-[10000] flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-2 shadow-2xl backdrop-blur-xl'
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          {/* Cat count */}
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

          {/* Clear button */}
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

          {/* Disable OIIA mode */}
          <button
            aria-label='Disable OIIA mode'
            className='flex items-center gap-1 rounded-full px-2 py-0.5 font-medium text-white/50 text-xs transition-all hover:scale-110 hover:bg-white/15 hover:text-white/80 active:scale-95'
            onClick={disableOiia}
            type='button'
          >
            <span>✕</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
