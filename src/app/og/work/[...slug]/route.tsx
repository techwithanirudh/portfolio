import { createOgRoute } from '@/app/og/_lib/create-og-route'
import { getWork, getWorkPages } from '@/lib/source'

export const { GET, generateStaticParams } = createOgRoute({
  collection: 'work',
  getPage: getWork,
  getPages: getWorkPages,
})
