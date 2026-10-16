import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  InvalidToolInputError,
  isStepCount,
  NoSuchToolError,
  smoothStream,
  streamText,
} from 'ai'
import { z } from 'zod'
import { getProfileFactsText } from '@/app/(llms)/utils'
import { systemPrompt } from '@/lib/ai/prompts/chat'
import { provider } from '@/lib/ai/providers'
import { isBotRequest } from '@/server/botid'
import type { MyUIMessage } from './types'
import { getLLMsTxt } from './utils/llms'
import { getPageContent } from './utils/tools/get-page-content'
import { navigateTool } from './utils/tools/navigate'
import { createSearchDocsTool } from './utils/tools/search-docs'
import { showContactFormTool } from './utils/tools/show-contact-form'

const MAX_BODY_LENGTH = 1_000_000
const MAX_MESSAGES = 50
const MAX_TEXT_LENGTH = 100_000

const messageSchema = z.looseObject({
  id: z.string(),
  parts: z.array(z.looseObject({ type: z.string() })),
  role: z.enum(['user', 'assistant']),
})

const requestSchema = z.object({
  messages: z
    .array(messageSchema)
    .min(1)
    .max(MAX_MESSAGES)
    .refine(
      (messages) =>
        messages
          .flatMap((message) => message.parts)
          .reduce(
            (total, part) =>
              total + (typeof part.text === 'string' ? part.text.length : 0),
            0
          ) <= MAX_TEXT_LENGTH,
      { message: 'Conversation is too long.' }
    ),
})

const logError = (label: string, error: unknown) => {
  console.error(
    label,
    error instanceof Error
      ? { message: error.message, name: error.name }
      : String(error)
  )
}

const parseMessages = async (request: Request) => {
  const body = await request.text()

  if (body.length > MAX_BODY_LENGTH) {
    return null
  }

  try {
    const result = requestSchema.safeParse(JSON.parse(body))
    return result.success ? (result.data.messages as MyUIMessage[]) : null
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  try {
    if (await isBotRequest()) {
      return new Response('Bot protection blocked this request.', {
        status: 403,
      })
    }

    const messages = await parseMessages(request)

    if (!messages) {
      return new Response('Invalid chat request.', { status: 400 })
    }

    const handleStreamError = (error: unknown) => {
      logError('Chat stream error:', error)

      if (NoSuchToolError.isInstance(error)) {
        return 'The model tried to call an unknown tool.'
      }
      if (InvalidToolInputError.isInstance(error)) {
        return 'The model called a tool with invalid arguments.'
      }

      return 'An unknown error occurred.'
    }

    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        const [modelMessages, llms] = await Promise.all([
          convertToModelMessages<MyUIMessage>(messages, {
            convertDataPart(part) {
              if (part.type === 'data-client') {
                return {
                  text: `[Client Context: ${JSON.stringify(part.data)}]`,
                  type: 'text',
                }
              }
            },
            ignoreIncompleteToolCalls: true,
          }),
          getLLMsTxt(),
        ])

        const result = streamText({
          experimental_transform: smoothStream({
            chunking: 'line',
            delayInMs: 20,
          }),
          instructions: systemPrompt({
            facts: getProfileFactsText(),
            llms,
          }),
          messages: modelMessages,
          model: provider.languageModel('chat-model'),
          providerOptions: {
            openai: {
              reasoningEffort: 'low',
              reasoningSummary: 'auto',
              serviceTier: 'priority',
              textVerbosity: 'medium',
            },
          },
          stopWhen: isStepCount(10),
          toolChoice: 'auto',
          tools: {
            getPageContent,
            navigate: navigateTool,
            searchDocs: createSearchDocsTool(writer),
            showContactForm: showContactFormTool,
          },
        })

        writer.merge(
          result.toUIMessageStream({
            onError: handleStreamError,
          })
        )
      },
      originalMessages: messages,
    })

    return createUIMessageStreamResponse({ stream })
  } catch (error) {
    logError('Failed to process chat request:', error)

    return new Response('Failed to process chat request.', {
      status: 500,
    })
  }
}
