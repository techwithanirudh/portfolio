import {
  type BlogPage,
  getSortedByDatePosts,
  getSortedProjects,
  type ProjectPage,
} from '@/lib/source'

interface ContentIndexLinks {
  blog: (page: BlogPage) => string
  projects: (page: ProjectPage) => string
}

const indexLine = (
  { description, title }: { description?: string; title: string },
  href: string
) => `- [${title}](${href})${description ? `: ${description}` : ''}`

export const getContentIndexText = (links: ContentIndexLinks) => `## Projects

${getSortedProjects()
  .map((item) => indexLine(item.data, links.projects(item)))
  .join('\n')}

## Blog

${getSortedByDatePosts()
  .map((item) => indexLine(item.data, links.blog(item)))
  .join('\n')}
`
