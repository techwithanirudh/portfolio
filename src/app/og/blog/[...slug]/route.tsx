import { createOgRoute } from '@/app/og/_lib/route'
import { getPost, getPosts } from '@/lib/source'

export const { GET, generateStaticParams } = createOgRoute({
  collection: 'blog',
  getPage: getPost,
  getPages: getPosts,
})
