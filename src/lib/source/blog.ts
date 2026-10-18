import { blog } from 'fumadocs-mdx:collections/server'
import { loader } from 'fumadocs-core/source'
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server'

// TODO(slopradar): unclear-name: `post` is the blog loader and its sibling is `workSource`, so call sites alias it (`post as blogSource` in search-docs.ts), rename to blogSource
export const post = loader(toFumadocsSource(blog, []), {
  baseUrl: '/blog',
})

export const { getPage: getPost, getPages: getPosts } = post

export type BlogPage = ReturnType<typeof getPosts>[number]

const posts = getPosts()

export const getSortedByDatePosts = () =>
  posts.toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime())

export const getTags = () => {
  const tagSet = new Set<string>()

  for (const post of posts) {
    if (post.data.tags) {
      for (const tag of post.data.tags) {
        tagSet.add(tag)
      }
    }
  }

  return Array.from(tagSet).toSorted()
}

export const getPostsByTag = (tag: string) =>
  getSortedByDatePosts().filter((post) => post.data.tags?.includes(tag))
