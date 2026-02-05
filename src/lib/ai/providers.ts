import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import { customProvider } from 'ai'

export const provider = customProvider({
  languageModels: {
    'chat-model': openai('gpt-5-mini'),
    'moderation-model': google('gemini-3-flash-preview'),
  },
})
