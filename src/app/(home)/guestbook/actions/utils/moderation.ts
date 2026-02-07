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
      type: 'text',
      text: `Moderate this guestbook entry:\n\nMessage:\n${message}. If a signature image is included, also moderate the content of the signature.`,
    },
  ]

  if (signature) {
    userContent.push({
      type: 'image',
      image: signature.data,
      mediaType: signature.mediaType,
    })
  }

  try {
    const { output } = await generateText({
      model: provider.languageModel('moderation-model'),
      system: moderationPrompt,
      output: Output.object({
        schema: ModerationResultSchema,
      }),
      messages: [
        {
          role: 'user',
          content: userContent,
        },
      ],
    })

    return output
  } catch (error) {
    console.error('Guestbook moderation failed:', {
      error:
        error instanceof Error
          ? { name: error.name, message: error.message }
          : String(error),
    })

    return {
      allowed: false,
      reason: 'Could not verify content safety. Please try again.',
    }
  }
}
