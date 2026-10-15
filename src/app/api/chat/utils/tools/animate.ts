import { tool } from 'ai'
import { z } from 'zod'
import {
  avatarNames,
  moodNames,
  type TrickName,
  trickDescriptions,
  trickNames,
} from '@/components/features/assistant/mascot/constants'

const pickTrick = (): TrickName =>
  trickNames[Math.floor(Math.random() * trickNames.length)] ?? 'spin'

export const animateTool = tool({
  description:
    'Make the dog on screen really move: perform a physical trick (spin, jump, roll over, play dead, backflip), play a reaction, or swap to another avatar. For "do a trick" call this once with trick set to random. The result says which trick actually happened, so describe exactly that in your reply.',
  execute: ({ avatar, mood, trick }) => {
    const performed = trick === 'random' ? pickTrick() : trick
    return {
      avatar,
      mood,
      success: true,
      trick: performed,
      trickDescription: performed ? trickDescriptions[performed] : undefined,
    }
  },
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
      trick: z
        .enum([...trickNames, 'random'])
        .optional()
        .describe(
          'Physical trick to perform. Use random when the user just asks for a trick.'
        ),
    })
    .refine((input) => input.avatar || input.mood || input.trick, {
      message: 'Provide an avatar, a mood, a trick, or a combination',
    }),
})
