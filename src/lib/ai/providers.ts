import { openai } from '@ai-sdk/openai'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { customProvider } from 'ai'
import { createRetryable } from 'ai-retry'
import { env } from '@/env'

const hackclub = createOpenRouter({
  apiKey: env.HACKCLUB_API_KEY,
  baseURL: 'https://ai.hackclub.com/proxy/v1',
})

const onError = (context: {
  current: { model: { provider: string; modelId: string } }
}) => {
  const { model } = context.current
  console.error(
    `error with model ${model.provider}/${model.modelId}, switching to next model`
  )
}

const chatModel = createRetryable({
  model: openai('gpt-6-luna'),
  onError,
  retries: [
    hackclub('z-ai/glm-5.3-flash'),
    hackclub('deepseek/deepseek-v4.1-flash'),
  ],
})

const moderationModel = createRetryable({
  model: hackclub('google/gemini-3-flash-preview'),
  onError,
  retries: [hackclub('google/gemini-2.5-flash')],
})

export const provider = customProvider({
  languageModels: {
    'chat-model': chatModel,
    'moderation-model': moderationModel,
  },
})
