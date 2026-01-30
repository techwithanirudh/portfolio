import { skills, technologies } from '@/constants/portfolio/skills'
import { url } from '@/lib/url'

export function getSkillsText() {
  return `# Skills
Route: ${url('/about')}

## Categories

${skills
  .map(
    (item) =>
      `### ${item.title}

${item.description}`
  )
  .join('\n\n')}

## Technologies

${technologies.map((item) => `- ${item.label}`).join('\n')}
`
}
