import { experiences } from '@/constants/portfolio/experiences'
import { formatPeriod } from '@/lib/employment-period'
import { url } from '@/lib/url'

export function getExperienceText() {
  return `# Experience
Route: ${url('/about')}

${experiences
  .map((item) =>
    item.positions
      .map((position) => {
        const skills = position.skills?.join(', ') ?? 'N/A'
        const period = formatPeriod(
          position.employmentPeriod.start,
          position.employmentPeriod.end
        )
        return `## ${position.title} | ${item.companyName}\n\nDuration: ${period}\n\nSkills: ${skills}\n\n${position.description?.trim() ?? ''}`
      })
      .join('\n\n')
  )
  .join('\n\n')}
`
}
