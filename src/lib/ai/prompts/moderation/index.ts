import { corePrompt } from './core'
import { directivesPrompt } from './directives'
import { examplesPrompt } from './examples'

export const guestbookModerationPrompt = [
  corePrompt,
  directivesPrompt,
  examplesPrompt,
]
  .filter(Boolean)
  .join('\n\n')
  .trim()
