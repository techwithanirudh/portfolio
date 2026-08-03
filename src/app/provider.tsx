'use client'

import { ProgressProvider } from '@bprogress/next/app'
import { SoundProvider } from '@web-kits/audio/react'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import type { ReactNode } from 'react'
import Analytics from '@/components/analytics'
import { Assistant, AssistantTrigger } from '@/components/features/assistant'
import { MobileNav } from '@/components/layout/header/mobile'
import { SmoothCursor } from '@/components/smooth-cursor'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

export function Provider({
  children,
}: {
  children: ReactNode
}): React.ReactElement {
  return (
    <SoundProvider>
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
      <SmoothCursor />
    </SoundProvider>
  )
}
