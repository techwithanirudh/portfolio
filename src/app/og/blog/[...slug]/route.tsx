import { createOgRoute } from '@/app/og/_lib/route'
import { getPost, getPosts } from '@/lib/source'

export const { GET, generateStaticParams } = createOgRoute({
  collection: 'blog',
  defaultDescription: 'Read the full post on the website.',
  getPage: getPost,
  getPages: getPosts,
  label: 'Blog',
  withBackgroundImage: true,
})
