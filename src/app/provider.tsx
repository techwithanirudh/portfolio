'use client'

import { ProgressProvider } from '@bprogress/next/app'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { AuthUIProvider } from '@daveyplate/better-auth-ui'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { Toaster } from 'sonner'
import Analytics from '@/components/analytics'
import { SmoothCursor } from '@/components/smooth-cursor'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { ThemeProvider } from '@/components/theme-provider'
import { authClient } from '@/lib/auth-client'
import Link from "next/link"

export function Provider({
  children,
}: {
  children: ReactNode
}): React.ReactElement {
  const router = useRouter()

  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      disableTransitionOnChange
      enableSystem
    >
      <AuthUIProvider
        authClient={authClient}
        navigate={router.push}
        onSessionChange={() => {
          router.refresh()
        }}
        replace={router.replace}
        Link={Link}
        viewPaths={{
          SIGN_IN: "login",
          SIGN_OUT: "logout",
          SIGN_UP: "register",
          FORGOT_PASSWORD: "forgot-password",
          RESET_PASSWORD: "reset-password",
          MAGIC_LINK: "magic"
        }}
      >
        <ProgressProvider
          color='var(--color-primary)'
          delay={1000}
          height='2px'
          options={{
            showSpinner: false,
          }}
          shallowRouting
          startOnLoad
          stopDelay={1000}
        >
          <TooltipProvider>{children}</TooltipProvider>
        </ProgressProvider>
      </AuthUIProvider>
      <Analytics />
      <Toaster />
      <TailwindIndicator />
      <SmoothCursor />
    </ThemeProvider>
  )
}
