import { pages } from '@/constants/pages'
import { groupStack, stackIntro } from '@/constants/portfolio/skills'
import { url } from '@/lib/url'

export function getStackText() {
  return `# Stack
Route: ${url(`${pages.about.path}#stack`)}

${stackIntro}

${groupStack()
  .map(
    ([category, labels]) =>
      `## ${category}\n\n${labels.map((label) => `- ${label}`).join('\n')}`
  )
  .join('\n\n')}
`
}
