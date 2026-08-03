'use client'

import { ProgressProvider } from '@bprogress/next/app'
import { SoundProvider } from '@web-kits/audio/react'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import type { ReactNode } from 'react'
import { AISearch } from '@/components/features/assistant/chat'
import { AISearchTrigger } from '@/components/features/assistant/search-trigger'
import { MobileNav } from '@/components/layout/header/mobile/mobile-nav'
import Analytics from '@/components/providers/analytics'
import { SmoothCursor } from '@/components/providers/smooth-cursor'
import { TailwindIndicator } from '@/components/providers/tailwind-indicator'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

export function Provider({
  children,
}: {
  children: ReactNode
}): React.ReactElement {
  return (
    <SoundProvider>
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
          <TooltipProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
          </TooltipProvider>
        </ProgressProvider>
        <AISearchTrigger />
        <MobileNav />
      </AISearch>
      <Analytics />
      <Toaster position='top-center' />
      <TailwindIndicator />
      <SmoothCursor />
    </SoundProvider>
  )
}
