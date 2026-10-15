'use client'

import { ProgressProvider } from '@bprogress/next/app'
import { SoundProvider } from '@web-kits/audio/react'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import type { ReactNode } from 'react'
import Analytics from '@/components/analytics'
import { FaviconEyes } from '@/components/favicon-eyes'
import { Assistant, AssistantTrigger } from '@/components/features/assistant'
import { MobileNav } from '@/components/layout/header/mobile'
import { Oiia, OiiaProvider } from '@/components/oiia'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { UiSounds } from '@/components/ui-sounds'
import { useThemeShortcut } from '@/hooks/use-theme-shortcut'
import { useSoundEnabled } from '@/lib/audio/preferences'

// Mounted once here so the `d` shortcut fires once, no matter how many
// theme toggles are on the page. Lives inside SoundProvider so it respects mute.
function ThemeShortcut() {
  useThemeShortcut()
  return null
}

export function Provider({
  children,
}: {
  children: ReactNode
}): React.ReactElement {
  const soundEnabled = useSoundEnabled()

  return (
    <SoundProvider enabled={soundEnabled}>
      <UiSounds />
      <ThemeShortcut />
      <FaviconEyes />
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
        <Oiia />
      </OiiaProvider>
    </SoundProvider>
  )
}
