import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { openai } from '@ai-sdk/openai'
import { customProvider } from 'ai'
import { createRetryable } from 'ai-retry';
import { env } from '@/env';

const hackclub = createOpenRouter({
  apiKey: env.HACKCLUB_API_KEY,
  baseURL: 'https://ai.hackclub.com/proxy/v1',
});

const moderationModel = createRetryable({
  model: hackclub('google/gemini-3-flash-preview'),
  retries: [
    hackclub('google/gemini-2.5-flash'),
    openai('gpt-5-mini'),
  ],
  onError: (context) => {
    const { model } = context.current;
    console.error(
      `error with model ${model.provider}/${model.modelId}, switching to next model`
    );
  },
});

export const provider = customProvider({
  languageModels: {
    'chat-model': openai('gpt-5-mini'),
    'moderation-model': moderationModel,
  },
})
