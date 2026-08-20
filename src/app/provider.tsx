'use client'

import { ProgressProvider } from '@bprogress/next/app'
import { SoundProvider } from '@web-kits/audio/react'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import type { ReactNode } from 'react'
import Analytics from '@/components/analytics'
import { Assistant, AssistantTrigger } from '@/components/features/assistant'
import { MobileNav } from '@/components/layout/header/mobile'
import { Oiia, OiiaProvider, useOiiaMode } from '@/components/oiia'
import { SmoothCursor } from '@/components/smooth-cursor'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

// Hide the regular smooth cursor while OIIA mode is active
function SmartCursor() {
  const { mode } = useOiiaMode()
  if (mode === 'oiia') {
    return null
  }
  return <SmoothCursor />
}

export function Provider({
  children,
}: {
  children: ReactNode
}): React.ReactElement {
  return (
    <SoundProvider>
      <OiiaProvider>
        <Assistant>
          <ProgressProvider
            color='var(--color-primary)'
            delay={200}
            height='2px'
            options={{
              showSpinner: false,
            }}
            shallowRouting
            startOnLoad
            stopDelay={200}
          >
            <TooltipProvider>
              <NuqsAdapter>{children}</NuqsAdapter>
            </TooltipProvider>
          </ProgressProvider>
          <AssistantTrigger />
          <MobileNav />
        </Assistant>
        <Analytics />
        <Toaster position='top-center' />
        <TailwindIndicator />
        <SmartCursor />
        <Oiia />
      </OiiaProvider>
    </SoundProvider>
  )
}
