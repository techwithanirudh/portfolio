import type { Metadata } from 'next'
import type { ReactNode } from 'react'

/**
 * Design prototypes for a site remake. They live outside the `(home)` group
 * so none of them inherit the real header, footer or styles, and they stay
 * out of search results until one of them graduates.
 */
export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: 'Variants',
}

export default function VariantsLayout({ children }: { children: ReactNode }) {
  return children
}
