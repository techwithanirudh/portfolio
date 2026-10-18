'use client'

import { useSound } from '@web-kits/audio/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useWebHaptics } from 'web-haptics/react'
import {
  error as errorSound,
  success as successSound,
} from '@/lib/audio/minimal'

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
  // TODO(slopradar): double-sound: blog/[slug]/page.client.tsx passes onCopySuccess/onCopyError that call toast.success/toast.error from @/lib/toast, which play the same success and error sounds, so one copy plays each sound twice; let one layer own the sound (an opt-out here, or the plain sonner toast there)
  const playSuccess = useSound(successSound)
  const playError = useSound(errorSound)

  const copy = useCallback(
    async (text: string | (() => string)) => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current)
      }

      try {
        const finalText = typeof text === 'function' ? text() : text
        await navigator.clipboard.writeText(finalText)

        setState('done')
        haptic('success')
        playSuccess()

        onCopySuccess?.(finalText)
      } catch (error) {
        setState('error')
        haptic('error')
        playError()

        onCopyError?.(error instanceof Error ? error : new Error('Copy failed'))
      } finally {
        resetTimeoutRef.current = setTimeout(() => {
          setState('idle')
        }, resetDelay)
      }
    },
    [onCopySuccess, onCopyError, haptic, playSuccess, playError, resetDelay]
  )

  return { copy, state } as const
}
