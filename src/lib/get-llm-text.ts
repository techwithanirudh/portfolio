import { format } from 'date-fns'
import { githubRepo, githubUser } from '@/constants/config'
import type { BlogPage, WorkPage } from '@/lib/source'

type ContentPage = BlogPage | WorkPage
type ContentType = 'blog' | 'work'
interface LLMTextOptions {
  level?: 'page' | 'section' | 'subsection'
}

interface ContentMeta {
  tags?: string[]
  type: ContentType
}

function getHeadingPrefix(level: 'page' | 'section' | 'subsection') {
  switch (level) {
    case 'page': {
      return '#'
    }
    case 'section': {
      return '##'
    }
    case 'subsection': {
      return '###'
    }
    default: {
      throw new Error(`Unknown heading level: ${level}`)
    }
  }
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

  return `${getHeadingPrefix(level)} ${page.data.title}
URL: ${page.url}
Source: https://raw.githubusercontent.com/${githubUser}/${githubRepo}/refs/heads/main/${path}
${tagsLine}
${page.data.description ?? ''}

${processed}

${page.data.lastModified ? `Last updated on ${format(new Date(page.data.lastModified), 'MMMM d, yyyy')}` : ''}`
}

export async function getBlogLLMText(
  page: BlogPage,
  options: LLMTextOptions = {}
) {
  return await getLLMText(page, { tags: page.data.tags, type: 'blog' }, options)
}

export async function getWorkLLMText(
  page: WorkPage,
  options: LLMTextOptions = {}
) {
  return await getLLMText(page, { type: 'work' }, options)
}
