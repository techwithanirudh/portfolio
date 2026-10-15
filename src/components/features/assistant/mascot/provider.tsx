'use client'

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { SimbaController } from './controller'

const MascotContext = createContext<SimbaController | undefined>(undefined)

/** Simba's controller, or undefined where he isn't shown (mobile) */
export function useMascot() {
  return useContext(MascotContext)
}

interface MascotProviderProps {
  children?: ReactNode
  disabled?: boolean
}

export function MascotProvider({ children, disabled }: MascotProviderProps) {
  const [mascot, setMascot] = useState<SimbaController>()

  useEffect(() => {
    if (disabled) {
      return
    }
    const controller = new SimbaController()
    controller.start()
    setMascot(controller)
    return () => {
      controller.dispose()
      setMascot(undefined)
    }
  }, [disabled])

  return (
    <MascotContext.Provider value={mascot}>{children}</MascotContext.Provider>
  )
}
