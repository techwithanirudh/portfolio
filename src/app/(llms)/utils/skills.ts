import { skills } from '@/constants/portfolio/skills'
import { url } from '@/lib/url'

export function getSkillsText() {
  return `# Skills
Route: ${url('/about')}

${skills
  .map(
    (item) =>
      `## ${item.title}

${item.description}`
  )
  .join('\n\n')}
`
}
