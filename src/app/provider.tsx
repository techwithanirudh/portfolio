'use client'

import { ProgressProvider } from '@bprogress/next/app'
import { SoundProvider } from '@web-kits/audio/react'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import type { ReactNode } from 'react'
import { AISearchTrigger } from '@/components/ai/ai-search-trigger'
import { AISearch } from '@/components/ai/chat'
import Analytics from '@/components/analytics'
import { MobileNav } from '@/components/mobile-nav'
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
