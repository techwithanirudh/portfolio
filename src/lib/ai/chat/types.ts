import type { InferUITools, UIDataTypes, UIMessage } from 'ai'
import type { DocumentData } from 'flexsearch'
import { z } from 'zod'
// TODO(slopradar): layering: src/lib imports the tool set from src/app/api/chat, so lib depends on a route; move the tools into src/lib/ai/chat or move these types next to the route
import type { tools } from '@/app/api/chat/utils/tools'
import type { PageEntry } from '@/lib/source'

export type ChatTools = InferUITools<typeof tools>
export const contextDataSchema = z.object({
  text: z.string().trim().min(1),
})

type ChatDataTypes = UIDataTypes & {
  client: { location: string }
  context: z.infer<typeof contextDataSchema>
}

// TODO(slopradar): unclear name: `My` names nothing, rename to ChatUIMessage (9 importers)
export type MyUIMessage = UIMessage<never, ChatDataTypes, ChatTools>

// TODO(slopradar): misplaced and vague: only app/api/chat/utils/tools/search-docs.ts uses this, move it there and call it SearchDocument
export interface CustomDocument extends DocumentData {
  content: string
  description: string
  tag: PageEntry['tag']
  title: string
  url: string
}
