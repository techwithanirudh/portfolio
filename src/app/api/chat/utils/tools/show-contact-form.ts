import { tool } from 'ai'
import { z } from 'zod'

export const showContactFormTool = tool({
  description:
    'Show an inline contact form so the user can send a message from the chat.',
  inputSchema: z.object({
    prefill: z
      .object({
        email: z.string().optional().describe("User's email if mentioned"),
        message: z
          .string()
          .optional()
          .describe('A draft message from what the user said in the chat'),
        name: z.string().optional().describe("User's name if mentioned"),
      })
      .optional()
      .describe('Values to prefill in the form, taken from the chat'),
  }),
  outputSchema: z.object({
    email: z.string().optional(),
    message: z.string().optional(),
    name: z.string().optional(),
    reason: z.string().optional(),
    success: z.boolean(),
  }),
})
