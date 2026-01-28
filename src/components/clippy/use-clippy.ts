'use client'

import { useContext } from 'react'
import { ClippyContext } from './clippy-context'

export function useClippy() {
  const ctx = useContext(ClippyContext)
  if (!ctx) {
    throw new Error('useClippy must be used within ClippyProvider')
  }
  return ctx
}
