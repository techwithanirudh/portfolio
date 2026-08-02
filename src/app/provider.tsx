'use client'

import { ProgressProvider } from '@bprogress/next/app'
import { SoundProvider } from '@web-kits/audio/react'
import dynamic from 'next/dynamic'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import type { ReactNode } from 'react'
import { AISearchProvider } from '@/components/ai/chat-context'
import Analytics from '@/components/analytics'
import { MobileNav } from '@/components/mobile-nav'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

// Both are purely client-side extras (AI chat/Clippy panel, custom cursor)
// with no SSR output, so they're code-split out of the initial bundle and
// only fetched once the client is idle/hydrated.
const AISearchHeavy = dynamic(
  () => import('@/components/ai/chat').then((mod) => mod.AISearchHeavy),
  { ssr: false }
)
const SmoothCursor = dynamic(
  () => import('@/components/smooth-cursor').then((mod) => mod.SmoothCursor),
  { ssr: false }
)

export function Provider({
  children,
}: {
  children: ReactNode
}): React.ReactElement {
  return (
    <SoundProvider>
      <AISearchProvider>
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
        <MobileNav />
        <AISearchHeavy />
      </AISearchProvider>
      <Analytics />
      <Toaster position='top-center' />
      <TailwindIndicator />
      <SmoothCursor />
    </SoundProvider>
  )
}
