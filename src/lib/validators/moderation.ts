import { z } from 'zod'

export const ModerationResultSchema = z.object({
  allowed: z.boolean(),
  // TODO(slopradar): magic-number: 120 is also written in prompts/moderation/directives.ts, and a model reason over it fails Output.object parsing, so a safe entry is rejected as "Could not verify content safety"; export one constant and give the limit to the model with .describe()
  reason: z.string().min(1).max(120),
})
