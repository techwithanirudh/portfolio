import { corePrompt } from './core'
import { directivesPrompt } from './directives'
import { examplesPrompt } from './examples'
import { llmsPrompt } from './llms'
import { personalityPrompt } from './personality'
import { toolsPrompt } from './tools'
export const systemPrompt = ({ llms }: { llms: string }) =>
  [
    corePrompt,
    personalityPrompt,
    directivesPrompt,
    toolsPrompt,
    llmsPrompt(llms),
    examplesPrompt,
  ]
    .filter(Boolean)
    .join('\n\n')
    .trim()
