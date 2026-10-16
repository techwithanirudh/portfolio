import { tool } from 'ai'
import { z } from 'zod'
import {
  avatarNames,
  moodNames,
} from '@/components/features/assistant/mascot/constants'

export const animateTool = tool({
  description:
    'Make the dog on screen react: play a reaction animation or swap to another avatar.',
  execute: ({ avatar, mood }) => ({ avatar, mood, success: true }),
  inputSchema: z
    .object({
      avatar: z
        .enum(avatarNames)
        .optional()
        .describe('Avatar to switch to: rover (default dog) or rocky'),
      mood: z
        .enum(moodNames)
        .optional()
        .describe('Animation to play, e.g. celebrate, think, surprised'),
    })
    .refine((input) => input.avatar || input.mood, {
      message: 'Provide an avatar, a mood, or both',
    }),
})
