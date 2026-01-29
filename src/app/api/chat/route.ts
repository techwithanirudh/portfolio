import { openai } from '@ai-sdk/openai'
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  InvalidToolInputError,
  NoSuchToolError,
  smoothStream,
  stepCountIs,
  streamText,
} from 'ai'
import { env } from '@/env'
import type { MyUIMessage } from './types'
import { getLLMsTxt } from './utils/llms'
import { systemPrompt } from './utils/prompts'
import { getPageContent } from './utils/tools/get-page-content'
import { createSearchDocsTool } from './utils/tools/search-docs'
import { createShowContactFormTool } from './utils/tools/show-contact-form'

export async function POST(request: Request) {
  try {
    const {
      messages,
      context,
    }: { messages: MyUIMessage[]; context?: Record<string, unknown> } =
      await request.json()

    const handleStreamError = (error: unknown) => {
      if (env.NODE_ENV !== 'production') {
        console.error('An error occurred:', {
          name: (error as Error).name,
          message: (error as Error).message,
        })
      }

      if (NoSuchToolError.isInstance(error)) {
        return 'The model tried to call an unknown tool.'
      }
      if (InvalidToolInputError.isInstance(error)) {
        return 'The model called a tool with invalid arguments.'
      }

      return 'An unknown error occurred.'
    }

    const stream = createUIMessageStream({
      originalMessages: messages,
      execute: async ({ writer }) => {
        const modelMessages = await convertToModelMessages(messages, {
          ignoreIncompleteToolCalls: true,
        })

        if (context) {
          writer.write({
            type: 'data-context',
            id: `context-${Date.now()}`,
            data: context,
          })
        }

        const llms = await getLLMsTxt()

        const result = streamText({
          model: openai('gpt-5-mini'),
          system: systemPrompt({
            llms,
          }),
          providerOptions: {
            openai: {
              reasoningEffort: 'minimal',
              reasoningSummary: 'auto',
              textVerbosity: 'medium',
              serviceTier: 'priority',
            },
          },
          tools: {
            searchDocs: createSearchDocsTool(writer),
            getPageContent,
            showContactForm: createShowContactFormTool(writer),
          },
          messages: modelMessages,
          toolChoice: 'auto',
          experimental_transform: smoothStream({
            delayInMs: 20,
            chunking: 'line',
          }),
          stopWhen: stepCountIs(15),
          onStepFinish: ({ toolResults }) => {
            if (env.NODE_ENV !== 'production') {
              console.log(
                `Step Results: ${JSON.stringify(toolResults, null, 2)}`
              )
            }
          },
        })

        writer.merge(
          result.toUIMessageStream({
            onError: handleStreamError,
          })
        )
      },
    })

    return createUIMessageStreamResponse({ stream })
  } catch (error) {
    if (env.NODE_ENV !== 'production') {
      console.error('Failed to process chat request:', {
        name: (error as Error).name,
        message: (error as Error).message,
      })
    }

    return new Response('Failed to process chat request.', {
      status: 500,
    })
  }
}
