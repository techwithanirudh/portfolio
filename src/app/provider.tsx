'use client'

import { ProgressProvider } from '@bprogress/next/app'
import { SoundProvider } from '@web-kits/audio/react'
import dynamic from 'next/dynamic'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import type { ReactNode } from 'react'
import Analytics from '@/components/analytics'
import { FaviconEyes } from '@/components/favicon-eyes'
import { AssistantProvider } from '@/components/features/assistant'
import { MobileNav } from '@/components/layout/header/mobile'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { UiSounds } from '@/components/ui-sounds'
import { useThemeShortcut } from '@/hooks/use-theme-shortcut'
import { useSoundEnabled } from '@/lib/audio/preferences'

// Client-only extras with no server HTML (the chat panel and mascot, and the
// custom cursor), split into their own chunks to keep them off the critical
// path. The panel reads its open state from AssistantProvider, so opening it
// before the chunk arrives still shows it once loaded
const Assistant = dynamic(
  () =>
    import('@/components/features/assistant/assistant').then(
      (mod) => mod.Assistant
    ),
  { ssr: false }
)
const SmoothCursor = dynamic(
  () => import('@/components/smooth-cursor').then((mod) => mod.SmoothCursor),
  { ssr: false }
)

// Mounted once so `d` fires once however many theme toggles render, and
// inside SoundProvider so it respects mute
function ThemeShortcut() {
  useThemeShortcut()
  return null
}

// Sits above RootProvider so the search dialog it renders respects mute too
export function SoundsProvider({
  children,
}: {
  children: ReactNode
}): React.ReactElement {
  const soundEnabled = useSoundEnabled()

  return (
    <SoundProvider enabled={soundEnabled}>
      <UiSounds />
      <ThemeShortcut />
      {children}
    </SoundProvider>
  )
}

export function Provider({
  children,
}: {
  children: ReactNode
}): React.ReactElement {
  return (
    <>
      <AssistantProvider>
        <ProgressProvider
          color='var(--color-primary)'
          delay={200}
          height='2px'
          options={{
            showSpinner: false,
          }}
          shallowRouting
          stopDelay={200}
        >
          <TooltipProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
          </TooltipProvider>
        </ProgressProvider>
        <Assistant />
        <MobileNav />
      </AssistantProvider>
      <Analytics />
      <Toaster position='top-center' />
      <TailwindIndicator />
      <SmoothCursor />
      <FaviconEyes />
    </>
  )
}
