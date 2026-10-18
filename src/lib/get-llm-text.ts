import { format } from 'date-fns'
import { githubBranch, githubRepo, githubUser } from '@/constants/config'
import type { BlogPage, WorkPage } from '@/lib/source'

type ContentPage = BlogPage | WorkPage
type ContentType = 'blog' | 'work'
const headingPrefix = {
  page: '#',
  section: '##',
} as const

interface LLMTextOptions {
  level?: keyof typeof headingPrefix
}

interface ContentMeta {
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
  const path = `content/${meta.type}/${page.path}`

  const tagsLine =
    meta.type === 'blog' ? `Tags: ${meta.tags?.join(', ') ?? ''}\n` : ''

  return `${headingPrefix[level]} ${page.data.title}
URL: ${page.url}
Source: https://raw.githubusercontent.com/${githubUser}/${githubRepo}/refs/heads/${githubBranch}/${path}
${tagsLine}
${page.data.description ?? ''}

${processed}

${page.data.lastModified ? `Last updated on ${format(page.data.lastModified, 'MMMM d, yyyy')}` : ''}`
}

export function getBlogLLMText(page: BlogPage, options: LLMTextOptions = {}) {
  return getLLMText(page, { tags: page.data.tags, type: 'blog' }, options)
}

export function getWorkLLMText(page: WorkPage, options: LLMTextOptions = {}) {
  return getLLMText(page, { type: 'work' }, options)
}
