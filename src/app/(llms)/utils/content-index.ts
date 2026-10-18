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

// TODO(slopradar): inconsistent: a missing description falls back to 'Project page' for work and '' for posts, pick one rule (or require description in the collection schema)
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
