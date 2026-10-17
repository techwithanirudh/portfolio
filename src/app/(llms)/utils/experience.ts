import { experiences } from '@/constants/portfolio/experiences'
import { url } from '@/lib/url'
import { toPlainPeriod } from './profile'

const relativeLink = /\]\((\/[^)]*)\)/g

const absoluteLinks = (markdown: string) =>
  markdown.replace(relativeLink, (_, path: string) => `](${url(path)})`)

export function getExperienceText() {
  return `# Experience
Route: ${url('/about#experience')}

Every role so far, newest first.

${experiences
  .flatMap((item) =>
    item.positions.map((position) => {
      const details = [
        `- Type: ${position.employmentType ?? 'Research'}`,
        `- Period: ${toPlainPeriod(position.employmentPeriod.start, position.employmentPeriod.end)}`,
        item.companyWebsite && `- Company website: ${item.companyWebsite}`,
        position.skills?.length && `- Skills: ${position.skills.join(', ')}`,
      ]
        .filter(Boolean)
        .join('\n')
      const body = position.description
        ? `\n\n${absoluteLinks(position.description.trim())}`
        : ''

      return `## ${position.title} | ${item.companyName}\n\n${details}${body}`
    })
  )
  .join('\n\n')}
`
}
