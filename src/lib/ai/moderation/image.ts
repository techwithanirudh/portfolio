import { generateText, Output } from 'ai'
import { moderationPrompt } from '@/lib/ai/prompts/moderation'
import { ModerationResultSchema } from '@/lib/validators'
import { provider } from '@/lib/ai/providers'

export const moderateImageUrl = async (url: string) => {
  const { output } = await generateText({
    model: provider.languageModel('moderation-model'),
    system: moderationPrompt,
    output: Output.object({
      schema: ModerationResultSchema,
    }),
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Moderate this uploaded image for a public site.',
          },
          {
            type: 'image',
            image: new URL(url),
          },
        ],
      },
    ],
  })

  return output
}
