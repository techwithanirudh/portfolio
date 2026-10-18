import type { ChatTools } from './types'

export const toolConfirmationMap = {
  getPageContent: false,
  navigate: false,
  renderPortfolio: false,
  searchDocs: false,
  showContactForm: true,
} as const satisfies Record<keyof ChatTools, boolean>
