import { tool, type UIMessageStreamWriter } from 'ai'
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

export const createShowContactFormTool = (writer: UIMessageStreamWriter) =>
  tool({
    description:
      'Show an inline contact form so the user can send a message to Anirudh directly from the chat',
    inputSchema: z.object({
      prefill: prefillSchema.describe(
        'Optional prefill data for the form fields based on context from the conversation'
      ),
    }),
    execute: ({ prefill }) => {
      writer.write({
        type: 'data-contact-form',
        id: `contact-form-${Date.now()}`,
        data: {
          status: 'idle',
          prefill,
        },
      })
      return 'Contact form displayed. Let the user know they can fill it out to send a message.'
    },
  })
