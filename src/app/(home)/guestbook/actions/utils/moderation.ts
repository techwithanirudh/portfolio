import { generateText, Output, type UserContent } from 'ai'
import { moderationPrompt } from '@/lib/ai/prompts/moderation'
import { provider } from '@/lib/ai/providers'
import type { Base64FileParts } from '@/lib/files'
import { ModerationResultSchema } from '@/lib/validators'

export interface ModerateGuestbookEntryInput {
  message: string
  signature?: Base64FileParts
}

export const moderateEntry = async (input: ModerateGuestbookEntryInput) => {
  const { message, signature } = input

  const userContent: UserContent = [
    {
      text: `Moderate this guestbook entry:\n\nMessage:\n${message}. If a signature image is included, also moderate the content of the signature.`,
      type: 'text',
    },
  ]

  if (signature) {
    userContent.push({
      image: signature.data,
      mediaType: signature.mediaType,
      type: 'image',
    })
  }

  try {
    const { output } = await generateText({
      messages: [
        {
          content: userContent,
          role: 'user',
        },
      ],
      model: provider.languageModel('moderation-model'),
      output: Output.object({
        schema: ModerationResultSchema,
      }),
      system: moderationPrompt,
    })

    return output
  } catch (error) {
    console.error('Guestbook moderation failed:', {
      error:
        error instanceof Error
          ? { message: error.message, name: error.name }
          : String(error),
    })

    return {
      allowed: false,
      reason: 'Could not verify content safety. Please try again.',
    }
  }
}
