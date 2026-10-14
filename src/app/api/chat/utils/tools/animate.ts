import { tool } from 'ai'
import { z } from 'zod'
import {
  avatarNames,
  moodNames,
} from '@/components/features/assistant/mascot/constants'

export const animateTool = tool({
  description:
    'Make the dog on screen do an animation or swap to another avatar. Use it when the user asks you to do a trick, show a reaction, or change how you look.',
  execute: ({ avatar, mood }) => ({
    avatar,
    mood,
    success: true,
  }),
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
