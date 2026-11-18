import { tool } from 'ai'
import { z } from 'zod'
import { CONFETTI_INTENSITIES } from '@/lib/confetti'

export const celebrateTool = tool({
  description:
    "Throw confetti over the whole site in the visitor's browser. Call it when the visitor asks to celebrate, party or see confetti, and otherwise only rarely, for a great moment, never to decorate an answer. At most once per reply.",
  execute: ({ intensity }) => ({ intensity }),
  inputSchema: z.object({
    intensity: z
      .enum(CONFETTI_INTENSITIES)
      .default('medium')
      .describe(
        'How much confetti: "small" for a quiet nod, "medium" by default, "big" only when the visitor asks for a full party.'
      ),
  }),
})
