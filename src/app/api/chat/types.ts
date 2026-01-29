import type { UIMessage } from 'ai'

export type ContactFormStatus = 'idle' | 'submitting' | 'success' | 'error'

export interface ContactFormPart {
  type: 'data-contact-form'
  id: string
  data: {
    status: ContactFormStatus
    prefill?: { name?: string; email?: string; message?: string }
    error?: string
  }
}

export type MyUIMessage = UIMessage & {
  parts: Array<
    | UIMessage['parts'][number]
    | {
        type: 'source-url'
        url: string
        title: string
      }
    | ContactFormPart
  >
}
