import { type ToolSet, tool } from 'ai'
import { z } from 'zod'
import { celebrateTool } from './celebrate'
import { getPageContent } from './get-page-content'
import { navigateTool } from './navigate'
import { renderPortfolioTool } from './render-portfolio'
import { showContactFormTool } from './show-contact-form'

// TODO(slopradar): duplicate-type: a fake searchDocs tool with a hand-copied schema exists only for InferUITools and has already drifted from search-docs.ts (no int, min, max or default), infer from ReturnType<typeof createSearchDocsTool>
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
  celebrate: celebrateTool,
  getPageContent,
  navigate: navigateTool,
  renderPortfolio: renderPortfolioTool,
  searchDocs: searchDocsToolType,
  showContactForm: showContactFormTool,
} satisfies ToolSet
