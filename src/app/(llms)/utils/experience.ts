import { experiences } from '@/constants/portfolio/experiences'
import { url } from '@/lib/url'

export function getExperienceText() {
  return `# Experience
Route: ${url('/about')}

${experiences
  .map(
    (item) =>
      `## ${item.role} | ${item.company}

Duration: ${item.timeframe}

${item.summary.trim()}`
  )
  .join('\n\n')}
`
}
