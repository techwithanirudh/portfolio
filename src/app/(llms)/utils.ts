import { baseUrl } from '@/constants'
import { socials } from '@/constants/navigation'
import { experiences } from '@/constants/portfolio/experiences'
import { skills } from '@/constants/portfolio/skills'
import { testimonials } from '@/constants/portfolio/testimonials'
import { description, owner, title } from '@/constants/site'

export function getAboutText() {
  return `# About

${description}

## Personal Information

- Name: ${owner}
- Display Name: ${title}
- Website: ${baseUrl.toString()}

## Social Links

${socials.map((item) => `- [${item.name}](${item.url})${item.description ? ` - ${item.description}` : ''}`).join('\n')}
`
}

export function getExperienceText() {
  return `# Experience

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

export function getSkillsText() {
  return `# Skills

${skills
  .map(
    (item) =>
      `## ${item.title}

${item.description}`
  )
  .join('\n\n')}
`
}

export function getTestimonialsText() {
  return `# Testimonials

${testimonials
  .map(
    (item) =>
      `## ${item.title}

> ${item.description}

— **${item.author.name}**`
  )
  .join('\n\n')}
`
}
