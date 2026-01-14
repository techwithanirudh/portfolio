import { format } from 'date-fns'
import { owner, repo } from '@/lib/github'
import type { BlogPage, WorkPage } from '@/lib/source'

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

export async function getBlogLLMText(
  page: BlogPage,
  options: {
    level?: 'page' | 'section' | 'subsection'
  } = {}
) {
  const level = options.level ?? 'page'
  const processed = await page.data.getText('processed')
  const path = `content/blog/${page.path}`

  return `${getHeadingPrefix(level)} ${page.data.title}
URL: ${page.url}
Source: https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/main/${path}
Tags: ${page.data.tags?.join(', ') ?? ''}

${page.data.description ?? ''}

${processed}

${page.data.lastModified ? `Last updated on ${format(new Date(page.data.lastModified), 'MMMM d, yyyy')}` : ''}`
}

export async function getWorkLLMText(
  page: WorkPage,
  options: {
    level?: 'page' | 'section' | 'subsection'
  } = {}
) {
  const level = options.level ?? 'page'
  const processed = await page.data.getText('processed')
  const path = `content/work/${page.path}`

  return `${getHeadingPrefix(level)} ${page.data.title}
URL: ${page.url}
Source: https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/main/${path}

${page.data.description ?? ''}

${processed}

${page.data.lastModified ? `Last updated on ${format(new Date(page.data.lastModified), 'MMMM d, yyyy')}` : ''}`
}
