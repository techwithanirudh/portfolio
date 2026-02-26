import { corePrompt } from './core'
import { directivesPrompt } from './directives'
import { examplesPrompt } from './examples'
import { llmsPrompt } from './llms'
import { pageContextPrompt } from './page-context'
import { personalityPrompt } from './personality'
import { toolsPrompt } from './tools'
type PageContext = {
  pathname?: string
}

export const systemPrompt = ({
  llms,
  pageContext,
  mode,
}: {
  llms: string
  pageContext?: PageContext
  mode?: 'default' | 'oiia'
}) =>
  [
    corePrompt(mode),
    personalityPrompt,
    directivesPrompt,
    toolsPrompt,
    pageContextPrompt(pageContext),
    llmsPrompt(llms),
    examplesPrompt,
  ]
    .filter(Boolean)
    .join('\n\n')
    .trim()
