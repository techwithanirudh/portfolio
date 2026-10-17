import type { Metadata } from 'next'
import { NotFoundContent } from '@/components/features/not-found/not-found-content'
import { SiteShell } from '@/components/layout/site-shell'
import { createMetadata } from '@/lib/metadata'

// Catches URLs no route matches, which render outside the (home) layout, so
// this page brings its own shell
export default function NotFound() {
  return (
    <SiteShell>
      <NotFoundContent />
    </SiteShell>
  )
}

export const metadata: Metadata = createMetadata({
  description: "This page doesn't exist.",
  robots: { follow: false, index: false },
  title: 'Not Found',
})
