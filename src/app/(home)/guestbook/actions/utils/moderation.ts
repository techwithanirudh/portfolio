import { generateText, Output, type UserContent } from 'ai'
import { guestbookModerationPrompt } from '@/lib/ai/prompts/moderation'
import { provider } from '@/lib/ai/providers'
import { parseB64File } from '@/lib/files'
import { GuestbookModerationResultSchema } from '@/lib/validators'

export interface ModerateGuestbookEntryInput {
  message: string
  signature?: string
}

export const moderateGuestbookEntry = async (
  input: ModerateGuestbookEntryInput
) => {
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
      system: guestbookModerationPrompt,
      output: Output.object({
        schema: GuestbookModerationResultSchema,
      }),
      messages: [
        {
          role: 'user',
          content: userContent,
        },
      ],
    })

    return output
  } catch (_error) {
    return {
      allowed: false,
      reason: 'Could not verify content safety. Please try again.',
    }
  }
}
