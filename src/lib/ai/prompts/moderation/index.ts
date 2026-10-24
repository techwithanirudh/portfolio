import { corePrompt } from './core'
import { directivesPrompt } from './directives'
import { examplesPrompt } from './examples'

export const moderationPrompt = [
  corePrompt,
  directivesPrompt,
  examplesPrompt,
].join('\n\n')
