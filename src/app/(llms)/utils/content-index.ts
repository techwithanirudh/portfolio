import {
  type BlogPage,
  getSortedByDatePosts,
  getSortedWork,
  type WorkPage,
} from '@/lib/source'

interface ContentIndexLinks {
  blog: (page: BlogPage) => string
  work: (page: WorkPage) => string
}

/** Every project and post as a markdown list, linked however the caller needs */
export const getContentIndexText = (links: ContentIndexLinks) => `## Work

${getSortedWork()
  .map(
    (item) =>
      `- [${item.data.title}](${links.work(item)}): ${item.data.description ?? 'Project page'}`
  )
  .join('\n')}

## Blog

${getSortedByDatePosts()
  .map(
    (item) =>
      `- [${item.data.title}](${links.blog(item)}): ${item.data.description ?? ''}`
  )
  .join('\n')}
`
