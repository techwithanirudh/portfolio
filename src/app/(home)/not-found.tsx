import type { Metadata } from 'next'
import { NotFoundContent } from '@/components/features/not-found/not-found-content'
import { createMetadata } from '@/lib/metadata'

// Catches notFound() from pages under (home), which already sit inside the
// site shell, so the root not-found would draw a second header
export default function NotFound() {
  return <NotFoundContent />
}

export const metadata: Metadata = createMetadata({
  description: "This page doesn't exist.",
  robots: { follow: false, index: false },
  title: 'Not found',
})
