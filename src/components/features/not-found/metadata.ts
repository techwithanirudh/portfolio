import { createMetadata } from '@/lib/metadata'

export const notFoundMetadata = createMetadata({
  description: "This page doesn't exist.",
  robots: { follow: false, index: false },
  title: 'Not found',
})
