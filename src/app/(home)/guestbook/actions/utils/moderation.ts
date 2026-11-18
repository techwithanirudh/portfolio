import type { UserContent } from 'ai'
import type { Base64FileParts } from '@/lib/files'
import { moderate } from '@/server/moderation'

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

  return (
    (await moderate(userContent, 'Guestbook')) ?? {
      allowed: false,
      reason: "Couldn't run the safety check on your entry. Try again.",
    }
  )
}
