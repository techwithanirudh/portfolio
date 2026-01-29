import { tool } from 'ai'
import { z } from 'zod'
import { post, workSource } from '@/lib/source'

const normalizePath = (path: string) =>
  path.startsWith('/') ? path.slice(1) : path

const resolvePage = (path: string) => {
  const normalized = normalizePath(path)
  const [section, ...slugs] = normalized.split('/').filter(Boolean)

  if (section === 'blog') {
    return post.getPage(slugs)
  }

  if (section === 'work') {
    return workSource.getPage(slugs)
  }

  return null
}

export const getPageContent = tool({
  description: 'Get the content of a specific internal page.',
  inputSchema: z.object({
    path: z.string().describe('The path of the page to get the content of.'),
  }),
  execute: async ({ path }) => {
    const page = resolvePage(path)

    if (!page) {
      return {
        success: false,
        data: 'Page not found',
      }
    }

    return {
      success: true,
      data: await page.data.getText('processed'),
    }
  },
})
