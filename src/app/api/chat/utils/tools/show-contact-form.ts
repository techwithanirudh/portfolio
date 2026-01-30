import { tool } from 'ai'
import { z } from 'zod'

const prefillSchema = z
  .object({
    name: z.string().optional().describe("User's name if mentioned"),
    email: z.string().optional().describe("User's email if mentioned"),
    message: z
      .string()
      .optional()
      .describe('Suggested message based on conversation context'),
  })
  .optional()

export const contactFormOutputSchema = z.object({
  success: z.boolean(),
  reason: z.string().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
  message: z.string().optional(),
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
