import { tool } from 'ai'
import { z } from 'zod'

const prefillSchema = z
  .object({
    email: z.string().optional().describe("User's email if mentioned"),
    message: z
      .string()
      .optional()
      .describe('Suggested message based on conversation context'),
    name: z.string().optional().describe("User's name if mentioned"),
  })
  .optional()

export const contactFormOutputSchema = z.object({
  email: z.string().optional(),
  message: z.string().optional(),
  name: z.string().optional(),
  reason: z.string().optional(),
  success: z.boolean(),
})

export type ContactFormOutput = z.infer<typeof contactFormOutputSchema>

export const showContactFormTool = tool({
  description:
    'Show an inline contact form so the user can send a message, from the chat.',
  inputSchema: z.object({
    prefill: prefillSchema.describe(
      'Optional prefill data for the form fields based on chat context'
    ),
  }),
  outputSchema: contactFormOutputSchema,
})
