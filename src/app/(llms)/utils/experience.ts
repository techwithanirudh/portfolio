import { experiences } from '@/constants/portfolio/experiences'
import { absoluteMarkdownLinks, url } from '@/lib/url'
import { DEFAULT_EMPLOYMENT_TYPE, toPlainPeriod } from './profile'

// TODO(slopradar): llms-parity: 'Every role so far, newest first.' is typed again in about/_components/experience.tsx and llms.txt, read one shared constant in all three
export function getExperienceText() {
  return `# Experience
Route: ${url('/about#experience')}

Every role so far, newest first.

${experiences
  .flatMap((item) =>
    item.positions.map((position) => {
      const details = [
        `- Type: ${position.employmentType ?? DEFAULT_EMPLOYMENT_TYPE}`,
        `- Period: ${toPlainPeriod(position.employmentPeriod.start, position.employmentPeriod.end)}`,
        item.companyWebsite && `- Company website: ${item.companyWebsite}`,
        position.skills?.length && `- Skills: ${position.skills.join(', ')}`,
      ]
        .filter(Boolean)
        .join('\n')
      const body = position.description
        ? `\n\n${absoluteMarkdownLinks(position.description.trim())}`
        : ''

      return `## ${position.title} | ${item.companyName}\n\n${details}${body}`
    })
  )
  .join('\n\n')}
`
}
