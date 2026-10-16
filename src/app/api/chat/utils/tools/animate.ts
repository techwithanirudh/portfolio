import { tool } from 'ai'
import { z } from 'zod'
import { moodNames } from '@/components/features/assistant/mascot/constants'

export const animateTool = tool({
  description: 'Make the dog on screen react with an animation.',
  execute: ({ mood }) => ({ mood, success: true }),
  inputSchema: z.object({
    mood: z
      .enum(moodNames)
      .describe('Animation to play, e.g. celebrate, think, surprised'),
  }),
})
