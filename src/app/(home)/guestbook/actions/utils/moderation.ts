import { openai } from '@ai-sdk/openai'
import { generateText, Output, type UserContent } from 'ai'
import { guestbookModerationPrompt } from '@/lib/ai/prompts/moderation'
import { GuestbookModerationResultSchema } from '@/lib/validators'

type ModerationImageInput = string | URL | ArrayBuffer | Uint8Array | Buffer

export interface ModerateGuestbookEntryInput {
  message: string
  signature?: ModerationImageInput
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
      type: 'image',
      image: signature,
    })
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
