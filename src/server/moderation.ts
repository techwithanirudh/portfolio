import 'server-only'

import { generateText, Output, type UserContent } from 'ai'
import { moderationPrompt } from '@/lib/ai/prompts/moderation'
import { provider } from '@/lib/ai/providers'
import { ModerationResultSchema } from '@/lib/validators/moderation'

/** Runs the moderation model over one user message; null when the check itself fails */
export const moderate = async (content: UserContent, label: string) => {
  try {
    const { output } = await generateText({
      instructions: moderationPrompt,
      messages: [{ content, role: 'user' }],
      model: provider.languageModel('moderation-model'),
      output: Output.object({ schema: ModerationResultSchema }),
    })
    return output
  } catch (error) {
    console.error(`${label} moderation failed:`, error)
    return null
  }
}
