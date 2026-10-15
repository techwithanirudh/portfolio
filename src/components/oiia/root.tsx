'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useOiiaMode } from './provider'

// Stays mounted once found so turning it off can still animate out
const OiiaScene = dynamic(() => import('./scene').then((mod) => mod.OiiaScene))

export function Oiia() {
  const { mode } = useOiiaMode()
  const [found, setFound] = useState(false)

  useEffect(() => {
    if (mode === 'oiia') {
      setFound(true)
    }
  }, [mode])

  return found ? <OiiaScene /> : null
}
