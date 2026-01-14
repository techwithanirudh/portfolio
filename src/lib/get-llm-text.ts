import { owner, repo } from '@/lib/github'
import type { BlogPage, WorkPage } from '@/lib/source'
import { format } from 'date-fns'

export async function getBlogLLMText(page: BlogPage) {
  const processed = await page.data.getText('processed')
  const path = `content/blog/${page.path}`

  return `# ${page.data.title}
URL: ${page.url}
Source: https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/main/${path}

${page.data.description ?? ''}
        
${processed}

${page.data.lastModified ? `Last updated on ${format(new Date(page.data.lastModified), "MMMM d, yyyy")}` : ''}`
}

export async function getWorkLLMText(page: WorkPage) {
  const processed = await page.data.getText('processed')
  const path = `content/work/${page.path}`

  return `# ${page.data.title}
URL: ${page.url}
Source: https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/main/${path}

${page.data.description ?? ''}

${processed}

${page.data.lastModified ? `Last updated on ${format(new Date(page.data.lastModified), "MMMM d, yyyy")}` : ''}`
}
