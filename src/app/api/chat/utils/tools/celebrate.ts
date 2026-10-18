import { tool } from 'ai'
import { z } from 'zod'

export const celebrateTool = tool({
  description:
    "Throw confetti over the whole site in the visitor's browser. Call it when the visitor asks to celebrate, party or see confetti, and rarely otherwise, only for a genuinely great moment. At most once per reply.",
  // TODO(slopradar): dead-field: `success: true as const` can never be false, yet tools/celebrate.tsx gates the confetti on `output?.success`, return `{ intensity }` and drop the check there
  execute: ({ intensity }) => ({ intensity, success: true as const }),
  inputSchema: z.object({
    intensity: z
      .enum(['small', 'medium', 'big'])
      .default('medium')
      .describe(
        'How much confetti: "small" for a quiet nod, "medium" by default, "big" only when the visitor asks for a full party.'
      ),
  }),
})
