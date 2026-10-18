import { tool } from 'ai'
import { z } from 'zod'
import { getProfileFactsText } from '@/app/(llms)/utils'
import { markdownPages } from '@/app/(llms)/utils/markdown-pages'
import { post, workSource } from '@/lib/source'
import { parseSitePath } from './navigate'

const getStaticPageText = (name: string) => {
  const text = markdownPages.find((page) => page.name === name)?.getText()
  return name === 'about' ? `${getProfileFactsText()}\n${text}` : text
}

const getText = async (path: string) => {
  const [section, ...slugs] =
    parseSitePath(path)?.path.split('/').filter(Boolean) ?? []

  if (section === 'blog') {
    // TODO(slopradar): inconsistent: returns raw processed markdown while the .mdx routes serve getBlogLLMText/getWorkLLMText with title and URL, call those so the model reads the same text (x2)
    return await post.getPage(slugs)?.data.getText('processed')
  }

  if (section === 'projects') {
    return await workSource.getPage(slugs)?.data.getText('processed')
  }

  if (section && slugs.length === 0) {
    return getStaticPageText(section)
  }
}

export const getPageContent = tool({
  description: `Get the content of a specific internal page: a blog post, a project, or one of ${markdownPages.map((page) => page.name).join(', ')}.`,
  execute: async ({ path }) => {
    const data = await getText(path)

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
