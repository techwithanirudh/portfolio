import { corePrompt } from './core'
import { directivesPrompt } from './directives'
import { examplesPrompt } from './examples'

export const moderationPrompt = [
  corePrompt,
  directivesPrompt,
  examplesPrompt,
]
  .filter(Boolean)
  .join('\n\n')
  .trim()
