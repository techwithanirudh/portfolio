import { tool } from 'ai'
import { z } from 'zod'
import {
  getAboutText,
  getColophonText,
  getContactText,
  getExperienceText,
  getProfileFactsText,
  getSkillsText,
  getTestimonialsText,
  getUsesText,
} from '@/app/(llms)/utils'
import { post, workSource } from '@/lib/source'

const staticPageText: Record<string, () => string> = {
  about: () => `${getProfileFactsText()}\n${getAboutText()}`,
  colophon: getColophonText,
  contact: getContactText,
  experience: getExperienceText,
  stack: getSkillsText,
  testimonials: getTestimonialsText,
  uses: getUsesText,
}

const QUERY_OR_HASH = /[?#]/

const getText = async (path: string) => {
  const [section, ...slugs] = (path.split(QUERY_OR_HASH)[0] ?? '')
    .split('/')
    .filter(Boolean)

  if (section === 'blog') {
    return await post.getPage(slugs)?.data.getText('processed')
  }

  if (section === 'projects' || section === 'work') {
    return await workSource.getPage(slugs)?.data.getText('processed')
  }

  if (section && slugs.length === 0) {
    return staticPageText[section]?.()
  }
}

export const getPageContent = tool({
  description:
    'Get the content of a specific internal page: a blog post, a project, or one of about, experience, stack, testimonials, uses, colophon, contact.',
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
