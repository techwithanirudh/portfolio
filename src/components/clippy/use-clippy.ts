'use client'

import { useContext } from 'react'
import { ClippyContext } from './clippy-context'

export function useClippy() {
  return useContext(ClippyContext)
}
