import { type ToolSet, tool } from 'ai'
import { z } from 'zod'
import { getPageContent } from './get-page-content'
import { showContactFormTool } from './show-contact-form'
import { webSearchTool } from './web-search'

const searchDocsToolType = tool({
  description: 'Search the portfolio content',
  inputSchema: z.object({
    query: z.string(),
    tag: z.union([z.literal('all'), z.literal('blog'), z.literal('projects')]),
    locale: z.string().optional(),
    limit: z.number().optional(),
  }),
  execute: async () => 'Search results',
})

export const tools = {
  getPageContent,
  showContactForm: showContactFormTool,
  searchDocs: searchDocsToolType,
  webSearch: webSearchTool,
} satisfies ToolSet
