import { format } from 'date-fns'
import { githubBranch, githubRepo, githubUser } from '@/constants/config'
import type { BlogPage, ProjectPage } from '@/lib/source'

type ContentPage = BlogPage | ProjectPage
type ContentType = 'blog' | 'projects'
const headingPrefix = {
  page: '#',
  section: '##',
} as const

export const getContentSourcePath = (type: ContentType, page: ContentPage) =>
  `content/${type}/${page.path}`

interface LLMTextOptions {
  level?: keyof typeof headingPrefix
}

interface ContentMeta {
  facts?: Record<string, string | undefined>
  tags?: string[]
  type: ContentType
}

async function getLLMText(
  page: ContentPage,
  meta: ContentMeta,
  options: LLMTextOptions = {}
) {
  const level = options.level ?? 'page'
  const processed = await page.data.getText('processed')

  const tagsLine =
    meta.type === 'blog' ? `Tags: ${meta.tags?.join(', ') ?? ''}\n` : ''
  const factLines = Object.entries(meta.facts ?? {})
    .flatMap(([label, value]) => (value ? [`${label}: ${value}\n`] : []))
    .join('')

  return `${headingPrefix[level]} ${page.data.title}
URL: ${page.url}
Source: https://raw.githubusercontent.com/${githubUser}/${githubRepo}/refs/heads/${githubBranch}/${getContentSourcePath(meta.type, page)}
${tagsLine}${factLines}
${page.data.description ?? ''}

${processed}

${page.data.lastModified ? `Last updated on ${format(page.data.lastModified, 'MMMM d, yyyy')}` : ''}`
}

export function getBlogLLMText(page: BlogPage, options: LLMTextOptions = {}) {
  return getLLMText(page, { tags: page.data.tags, type: 'blog' }, options)
}

export function getProjectLLMText(
  page: ProjectPage,
  options: LLMTextOptions = {}
) {
  return getLLMText(
    page,
    {
      facts: { Platform: page.data.platform, Status: page.data.status },
      type: 'projects',
    },
    options
  )
}
