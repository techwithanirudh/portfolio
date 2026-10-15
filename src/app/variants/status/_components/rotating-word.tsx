// Adapted from nelsonlai.dev/src/components/home/hero.tsx (MIT, © 2025 Nelson Lai). See ../NOTICES.md
'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

interface RotatingWordProps {
  /** How long each word stays, in ms. */
  interval?: number
  words: readonly string[]
}

/**
 * Nelson's rotating hero word, re-colored to one accent and with
 * `useReducedMotion`: under reduced motion it stays on the first word.
 * All words are listed for screen readers, once.
 */
export function RotatingWord({ interval = 2400, words }: RotatingWordProps) {
  const [index, setIndex] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) {
      return
    }
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length)
    }, interval)
    return () => clearInterval(id)
  }, [interval, reduce, words.length])

  const word = words[index % words.length] ?? words[0]

  return (
    <>
      <span className='sr-only'>{words.join(', ')}</span>
      <span aria-hidden className='relative block h-[1.25em] overflow-hidden'>
        <AnimatePresence initial={false} mode='popLayout'>
          <motion.span
            animate={{ opacity: 1, y: 0 }}
            className='inline-block whitespace-nowrap text-[var(--accent)]'
            exit={{ opacity: 0, y: '-100%' }}
            initial={{ opacity: 0, y: '100%' }}
            key={word}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
              type: 'tween',
            }}
          >
            {word}
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  )
}
