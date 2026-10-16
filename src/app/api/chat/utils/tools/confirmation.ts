export const toolConfirmationMap = {
  getPageContent: false,
  navigate: false,
  searchDocs: false,
  showContactForm: true,
} as const

export type ToolName = keyof typeof toolConfirmationMap
