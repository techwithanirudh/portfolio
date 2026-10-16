import { createOgRoute } from '@/app/og/_lib/route'
import { getWork, getWorkPages } from '@/lib/source'

export const { GET, generateStaticParams } = createOgRoute({
  collection: 'work',
  defaultDescription: 'Read more about this project on the website.',
  getPage: getWork,
  getPages: getWorkPages,
  label: 'Projects',
})
