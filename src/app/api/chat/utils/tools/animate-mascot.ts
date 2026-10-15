import { tool } from 'ai'
import { z } from 'zod'

export const mascotMoods = [
  'celebrate',
  'think',
  'greet',
  'surprised',
  'write',
  'search',
  'look-up',
  'get-attention',
] as const

export const mascotAvatars = ['rover', 'rocky'] as const

export type MascotMood = (typeof mascotMoods)[number]
export type MascotAvatarName = (typeof mascotAvatars)[number]

export const animateMascotTool = tool({
  description:
    "Change simba's on-screen animation or swap his avatar. use it for a bit of fun when it fits the conversation (celebrating good news, looking thoughtful, greeting someone) or when the user asks to see another animation or avatar.",
  execute: async ({ animation, avatar }) => ({ animation, avatar }),
  inputSchema: z.object({
    animation: z
      .enum(mascotMoods)
      .optional()
      .describe('Mood to act out. Omit to only swap the avatar.'),
    avatar: z
      .enum(mascotAvatars)
      .optional()
      .describe(
        'Avatar to switch to: rover is the default dog, rocky is the alternate. Omit to keep the current one.'
      ),
  }),
})
