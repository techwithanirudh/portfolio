import { generateText, Output, type UserContent } from 'ai'
import { moderationPrompt } from '@/lib/ai/prompts/moderation'
import { provider } from '@/lib/ai/providers'
import type { Base64FileParts } from '@/lib/files'
import { ModerationResultSchema } from '@/lib/validators'

interface ModerateGuestbookEntryInput {
  message: string
  signature?: Base64FileParts
}

export const moderateEntry = async (input: ModerateGuestbookEntryInput) => {
  const { message, signature } = input

  const userContent: UserContent = [
    {
      text: `Moderate this guestbook entry:\n\nMessage:\n${message}`,
      type: 'text',
    },
  ]

  if (signature) {
    userContent.push({
      text: 'The entry also includes a signature image. Moderate its content too.',
      type: 'text',
    })
    userContent.push({
      data: signature.data,
      mediaType: signature.mediaType,
      type: 'file',
    })
  }

  try {
    const { output } = await generateText({
      instructions: moderationPrompt,
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
      reason: "Couldn't run the safety check on your entry. Try again.",
    }
  }
}
