import { generateText, Output, type UserContent } from 'ai'
import { moderationPrompt } from '@/lib/ai/prompts/moderation'
import { parseB64File } from '@/lib/files'
import { ModerationResultSchema } from '@/lib/validators'
import { provider } from '@/lib/ai/providers'

export interface ModerateGuestbookEntryInput {
  message: string
  signature?: string
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
    const parsedSignature = parseB64File(signature)

    if (!parsedSignature) {
      return {
        allowed: false,
        reason: 'Signature format is invalid.',
      }
    }

    userContent.push({
      type: 'image',
      image: parsedSignature.data,
      mediaType: parsedSignature.mediaType,
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
          : String(error)
    })

    return {
      allowed: false,
      reason: 'Could not verify content safety. Please try again.',
    }
  }
}
