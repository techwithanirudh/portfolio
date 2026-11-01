import { corePrompt } from './core'
import { directivesPrompt } from './directives'
import { examplesPrompt } from './examples'
import { factsPrompt } from './facts'
import { llmsPrompt } from './llms'
import { personalityPrompt } from './personality'
import { toolsPrompt } from './tools'

export const systemPrompt = ({
  facts,
  llms,
}: {
  facts: string
  llms: string
}) =>
  [
    corePrompt,
    personalityPrompt,
    directivesPrompt,
    toolsPrompt,
    factsPrompt(facts),
    llmsPrompt(llms),
    examplesPrompt,
  ].join('\n\n')
