import { pages } from '@/constants/pages'
import { experienceIntro, experiences } from '@/constants/portfolio/experiences'
import { formatPeriod } from '@/lib/employment-period'
import { absoluteMarkdownLinks, url } from '@/lib/url'
import { DEFAULT_EMPLOYMENT_TYPE } from './profile'

export function getExperienceText() {
  return `# Experience
Route: ${url(`${pages.about.path}#experience`)}

${experienceIntro}

${experiences
  .flatMap((item) =>
    item.positions.map((position) => {
      const details = [
        `- Type: ${position.employmentType ?? DEFAULT_EMPLOYMENT_TYPE}`,
        `- Period: ${formatPeriod(position.employmentPeriod.start, position.employmentPeriod.end, ' to ')}`,
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
