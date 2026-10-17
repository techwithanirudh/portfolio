'use client'

import { ProgressProvider } from '@bprogress/next/app'
import { SoundProvider } from '@web-kits/audio/react'
import { domAnimation, LazyMotion } from 'motion/react'
import dynamic from 'next/dynamic'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import type { ReactNode } from 'react'
import { AssistantProvider } from '@/components/features/assistant'
import { MobileNav } from '@/components/layout/header/mobile'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { UiSounds } from '@/components/ui-sounds'
import { useThemeShortcut } from '@/hooks/use-theme-shortcut'
import { useSoundEnabled } from '@/lib/audio/preferences'

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

function ThemeShortcut() {
  useThemeShortcut()
  return null
}

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
  // Animated components use the slim `m` and load these features once, here
  return (
    <LazyMotion features={domAnimation}>
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
      <Toaster position='top-center' />
      <TailwindIndicator />
      <SmoothCursor />
    </LazyMotion>
  )
}
