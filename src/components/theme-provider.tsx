'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type * as React from 'react'

// TODO(slopradar): pass-through-wrapper: re-exports next-themes' ThemeProvider with identical props (next-themes already ships 'use client'), import it from 'next-themes' in app/layout.tsx and delete this file
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
