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
import { systemPrompt } from '@/lib/ai/prompts/chat'
import { provider } from '@/lib/ai/providers'
import { contextDataSchema, type MyUIMessage } from './types'
import { getLLMsTxt } from './utils/llms'
import { getPageContent } from './utils/tools/get-page-content'
import { createSearchDocsTool } from './utils/tools/search-docs'
import { showContactFormTool } from './utils/tools/show-contact-form'

interface PageContext {
  pathname?: string
}

export async function POST(request: Request) {
  try {
    const {
      messages,
      pageContext,
    }: {
      messages: MyUIMessage[]
      pageContext?: PageContext
    } = await request.json()

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
        const modelMessages = await convertToModelMessages<MyUIMessage>(
          messages,
          {
            convertDataPart: (part) => {
              if (part.type !== 'data-context') {
                return undefined
              }

              const context = contextDataSchema.safeParse(part.data).data?.text
              if (!context) {
                return undefined
              }

              return {
                type: 'text',
                text: `\n\nSelected context (from page):\n"""\n${context}\n"""`,
              }
            },
            ignoreIncompleteToolCalls: true,
          }
        )

        const llms = await getLLMsTxt()

        const result = streamText({
          model: provider.languageModel('chat-model'),
          system: systemPrompt({
            llms,
            pageContext,
          }),
          providerOptions: {
            openai: {
              textVerbosity: 'medium',
              serviceTier: 'priority',
            },
          },
          tools: {
            searchDocs: createSearchDocsTool(writer),
            getPageContent,
            showContactForm: showContactFormTool,
          },
          messages: modelMessages,
          toolChoice: 'auto',
          experimental_transform: smoothStream({
            delayInMs: 20,
            chunking: 'line',
          }),
          stopWhen: stepCountIs(10),
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
