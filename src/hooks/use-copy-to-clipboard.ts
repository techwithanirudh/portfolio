'use client'

import { useEffect, useRef, useState } from 'react'
import { useWebHaptics } from 'web-haptics/react'

export type CopyState = 'idle' | 'done' | 'error'

interface UseCopyToClipboardOptions {
  onCopyError?: (error: Error) => void
  onCopySuccess?: (text: string) => void
  resetDelay?: number
}

export function useCopyToClipboard({
  onCopySuccess,
  onCopyError,
  resetDelay = 1500,
}: UseCopyToClipboardOptions = {}) {
  const [state, setState] = useState<CopyState>('idle')
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current)
      }
    },
    []
  )

  const { trigger: haptic } = useWebHaptics()

  const copy = async (text: string | (() => string)) => {
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current)
    }

    try {
      const finalText = typeof text === 'function' ? text() : text
      await navigator.clipboard.writeText(finalText)

      setState('done')
      haptic('success')

      onCopySuccess?.(finalText)
    } catch (error) {
      setState('error')
      haptic('error')

      onCopyError?.(error instanceof Error ? error : new Error('Copy failed'))
    } finally {
      resetTimeoutRef.current = setTimeout(() => {
        setState('idle')
      }, resetDelay)
    }
  }

  return { copy, state } as const
}
