import { tool } from 'ai'
import { z } from 'zod'
import { moodNames } from '@/components/features/assistant/mascot/constants'

export const animateTool = tool({
  description:
    'Make Simba, the dog on screen, do an animation. Use it when the user asks you to do a trick or show a reaction.',
  execute: ({ mood }) => ({ mood, success: true }),
  inputSchema: z.object({
    mood: z
      .enum(moodNames)
      .describe('Animation to play, e.g. celebrate, think, surprised'),
  }),
})
