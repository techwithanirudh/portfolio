import { openai } from '@ai-sdk/openai'
import { generateText, Output, type UserContent } from 'ai'
import { parseBase64DataUrl } from '@/lib/base64-data-url'
import { guestbookModerationPrompt } from '@/lib/ai/prompts/moderation'
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
      text: `Moderate this guestbook entry:\n\nMessage:\n${message}`,
    },
  ]

  if (signature) {
    userContent.push({
      type: 'text',
      text: 'A signature image is attached. Analyze the image content for safety.',
    })

    const parsedSignature = parseBase64DataUrl(signature)

    if (parsedSignature) {
      userContent.push({
        type: 'image',
        image: parsedSignature.data,
        mediaType: parsedSignature.mediaType,
      })
    }
  }

  try {
    const { output } = await generateText({
      model: openai('gpt-5-mini'),
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
  } catch {
    return {
      allowed: false,
      reason: 'Could not verify content safety. Please try again.',
    }
  }
}
