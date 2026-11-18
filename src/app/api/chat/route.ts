import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  InvalidToolInputError,
  isStepCount,
  NoSuchToolError,
  safeValidateUIMessages,
  smoothStream,
  streamText,
} from 'ai'
import { z } from 'zod'
import { getProfileFactsText } from '@/app/(llms)/utils/profile'
import { type ChatUIMessage, chatDataSchemas } from '@/lib/ai/chat/types'
import { systemPrompt } from '@/lib/ai/prompts/chat'
import { provider } from '@/lib/ai/providers'
import { isBotRequest } from '@/server/botid'
import { getAssistantContext } from './utils/context'
import { chatTools } from './utils/tools'
import { renderPortfolioTool } from './utils/tools/render-portfolio'

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

  if (body.length > 1_000_000) {
    return null
  }

  try {
    const parsed = z
      .object({ messages: z.array(z.unknown()).min(1).max(50) })
      .safeParse(JSON.parse(body))
    if (!parsed.success) {
      return null
    }
    const result = await safeValidateUIMessages<ChatUIMessage>({
      dataSchemas: chatDataSchemas,
      messages: parsed.data.messages,
      tools: chatTools,
    })
    if (!result.success) {
      return null
    }
    const textLength = result.data
      .flatMap((message) => message.parts)
      .reduce(
        (total, part) =>
          total +
          (part.type === 'text' || part.type === 'reasoning'
            ? part.text.length
            : 0),
        0
      )
    const fromVisitor = result.data.every(
      (message) => message.role !== 'system'
    )
    return fromVisitor && textLength <= 100_000 ? result.data : null
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
          convertToModelMessages<ChatUIMessage>(messages, {
            convertDataPart(part) {
              if (part.type === 'data-client') {
                return {
                  text: `[Client Context: ${JSON.stringify(part.data)}]`,
                  type: 'text',
                }
              }
              if (part.type === 'data-context') {
                return {
                  text: `[Selected Context: ${JSON.stringify(part.data)}]`,
                  type: 'text',
                }
              }
            },
            ignoreIncompleteToolCalls: true,
            // Earlier cards go back to the model as their short summary
            tools: { renderPortfolio: renderPortfolioTool },
          }),
          getAssistantContext(),
        ])

        const toolsAfterNavigation = Object.keys(chatTools).filter(
          (name): name is Exclude<keyof typeof chatTools, 'navigate'> =>
            name !== 'navigate'
        )

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
          prepareStep: ({ steps }) =>
            steps.some((step) =>
              step.toolResults.some(
                (result) =>
                  !result.dynamic &&
                  result.toolName === 'navigate' &&
                  result.output.success
              )
            )
              ? { activeTools: toolsAfterNavigation }
              : undefined,
          providerOptions: {
            openai: {
              reasoningEffort: 'low',
              reasoningSummary: 'auto',
              serviceTier: 'priority',
              textVerbosity: 'medium',
            },
          },
          stopWhen: isStepCount(10),
          tools: chatTools,
          toolsContext: { searchDocs: { writer } },
        })

        writer.merge(
          result.toUIMessageStream({
            onError: handleStreamError,
          })
        )
      },
      originalMessages: messages,
    })

    // The SDK's default `text/event-stream` names no charset, so tools that
    // decode the body by its header (DevTools, Playwright) read it as Latin-1
    return createUIMessageStreamResponse({
      headers: { 'content-type': 'text/event-stream; charset=utf-8' },
      stream,
    })
  } catch (error) {
    logError('Failed to process chat request:', error)

    return new Response('Failed to process chat request.', {
      status: 500,
    })
  }
}
