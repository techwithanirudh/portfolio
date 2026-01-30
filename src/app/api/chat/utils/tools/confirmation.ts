export const toolConfirmationMap = {
  searchDocs: false,
  getPageContent: false,
  showContactForm: true,
} as const

export type ToolName = keyof typeof toolConfirmationMap

export const getToolsRequiringConfirmation = (): ToolName[] =>
  (Object.keys(toolConfirmationMap) as ToolName[]).filter(
    (key) => toolConfirmationMap[key]
  )
