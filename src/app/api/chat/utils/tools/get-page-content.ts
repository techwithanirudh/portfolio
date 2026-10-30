import { tool } from 'ai'
import { z } from 'zod'
import { markdownPages } from '@/app/(llms)/utils/markdown-pages'
import { getPageMarkdown } from '@/app/(llms)/utils/site-path'

export const getPageContent = tool({
  description: `Get the full text of a page on this site: a blog post, a project, or one of ${markdownPages.map((page) => page.name).join(', ')}.`,
  execute: async ({ path }) => {
    const data = await getPageMarkdown(path)

    if (!data) {
      return {
        data: 'Page not found',
        success: false,
      }
    }

    return {
      data,
      success: true,
    }
  },
  inputSchema: z.object({
    path: z
      .string()
      .describe(
        'The page path, like "blog/hello-world", "projects/ai_tutor", "about" or "uses".'
      ),
  }),
})
