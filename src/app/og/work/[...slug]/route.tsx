import { createOgRoute } from '@/app/og/_lib/create-og-route'
import { getProject, getProjectPages } from '@/lib/source'

export const { GET, generateStaticParams } = createOgRoute({
  collection: 'work',
  getPage: getProject,
  getPages: getProjectPages,
})
