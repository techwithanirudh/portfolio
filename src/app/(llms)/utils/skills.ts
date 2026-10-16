import { url } from '@/lib/url'
import { groupStack } from './profile'

export function getSkillsText() {
  return `# Stack
Route: ${url('/about#stack')}

The tools I reach for most.

${groupStack()
  .map(
    ([category, labels]) =>
      `## ${category}\n\n${labels.map((label) => `- ${label}`).join('\n')}`
  )
  .join('\n\n')}
`
}
