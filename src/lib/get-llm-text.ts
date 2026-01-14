import { format } from 'date-fns'
import { owner, repo } from '@/lib/github'
import type { BlogPage, WorkPage } from '@/lib/source'

export async function getBlogLLMText(
  page: BlogPage,
  options: {
    level?: 'page' | 'section' | 'subsection'
  } = {}
) {
  const level = options.level ?? 'page'
  const processed = await page.data.getText('processed')
  const path = `content/blog/${page.path}`

  return `${level === 'page' ? '#' : level === 'section' ? '##' : '###'} ${page.data.title}
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

  return `${level === 'page' ? '#' : level === 'section' ? '##' : '###'} ${page.data.title}
URL: ${page.url}
Source: https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/main/${path}

${page.data.description ?? ''}

${processed}

${page.data.lastModified ? `Last updated on ${format(new Date(page.data.lastModified), 'MMMM d, yyyy')}` : ''}`
}
