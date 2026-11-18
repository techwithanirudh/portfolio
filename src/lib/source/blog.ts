import { blog } from 'fumadocs-mdx:collections/server'
import { loader } from 'fumadocs-core/source'
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server'

export const blogSource = loader(toFumadocsSource(blog, []), {
  baseUrl: '/blog',
})

export const { getPage: getPost, getPages: getPosts } = blogSource

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

/** The posts before (newer) and after (older) this one, wrapping at the ends */
export const getAdjacentPosts = (page: BlogPage) => {
  const sorted = getSortedByDatePosts()
  const index = sorted.findIndex((post) => post.url === page.url)
  const at = (offset: number) => {
    const post = sorted[(index + offset + sorted.length) % sorted.length]
    return post && post.url !== page.url ? post : undefined
  }

  return { next: at(1), previous: at(-1) }
}
