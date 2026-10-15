import { type ToolSet, tool } from 'ai'
import { z } from 'zod'
import { animateMascotTool } from './animate-mascot'
import { getPageContent } from './get-page-content'
import { showContactFormTool } from './show-contact-form'

const searchDocsToolType = tool({
  description: 'Search the portfolio content',
  execute: async () => 'Search results',
  inputSchema: z.object({
    limit: z.number().optional(),
    locale: z.string().optional(),
    query: z.string(),
    tag: z.union([z.literal('all'), z.literal('blog'), z.literal('projects')]),
  }),
})

export const tools = {
  animateMascot: animateMascotTool,
  getPageContent,
  searchDocs: searchDocsToolType,
  showContactForm: showContactFormTool,
} satisfies ToolSet
