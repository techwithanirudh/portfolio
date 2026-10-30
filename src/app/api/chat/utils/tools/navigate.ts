import { tool } from 'ai'
import { z } from 'zod'
import {
  navigateOutputSchema,
  resolveNavigation,
} from '@/app/(llms)/utils/site-path'

export const navigateTool = tool({
  description:
    'Take the visitor to a page or a section of this site. The browser navigates as soon as this succeeds. Only call it when the visitor asks to go somewhere or to be shown something.',
  execute: ({ path }) => resolveNavigation(path),
  inputSchema: z.object({
    path: z
      .string()
      .describe(
        'A site path from the site map, optionally with a #section id, like "/about#experience", "/projects/ai_tutor" or "/contact".'
      ),
  }),
  outputSchema: navigateOutputSchema,
})
