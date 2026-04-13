'use client'

import { ProgressProvider } from '@bprogress/next/app'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import type { ReactNode } from 'react'
import { AISearchTrigger } from '@/components/ai/ai-search-trigger'
import { AISearch } from '@/components/ai/chat'
import Analytics from '@/components/analytics'
import {
  OiiaAudio,
  OiiaEngine,
  OiiaProvider,
  OiiaWidget,
  useOiiaMode,
} from '@/components/oiia'
import { SmoothCursor } from '@/components/smooth-cursor'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { ThemeProvider } from '@/components/theme-provider'
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
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      disableTransitionOnChange
      enableSystem
    >
      <NuqsAdapter>
        <OiiaProvider>
          <AISearch>
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
              <TooltipProvider>{children}</TooltipProvider>
            </ProgressProvider>
            <AISearchTrigger />
          </AISearch>
          <Analytics />
          <Toaster />
          <TailwindIndicator />
          <SmartCursor />
          <OiiaEngine />
          <OiiaWidget />
          <OiiaAudio />
        </OiiaProvider>
      </NuqsAdapter>
    </ThemeProvider>
  )
}
