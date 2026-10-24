import { notFoundMetadata } from '@/components/features/not-found/metadata'
import { NotFoundContent } from '@/components/features/not-found/not-found-content'

// Catches notFound() from pages under (home), which already sit inside the
// site shell, so the root not-found would draw a second header
export default function NotFound() {
  return <NotFoundContent />
}

export const metadata = notFoundMetadata
