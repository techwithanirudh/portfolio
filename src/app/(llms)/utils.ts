import { baseUrl } from '@/constants'
import { socials } from '@/constants/navigation'
import {
  attributions,
  technology,
  typography,
} from '@/constants/portfolio/colophon'
import { experiences } from '@/constants/portfolio/experiences'
import { skills } from '@/constants/portfolio/skills'
import { testimonials } from '@/constants/portfolio/testimonials'
import { hardware, software } from '@/constants/portfolio/uses'
import { description, owner, title } from '@/constants/site'
import { url } from '@/lib/url'

export function getAboutText() {
  return `# About 
Route: ${url('/about')}

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

export function getTestimonialsText() {
  return `# Testimonials
Route: ${url('/about')}

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

export function getUsesText() {
  return `# Uses
Route: ${url('/uses')}

## Hardware

${hardware
  .map(
    (item) =>
      `- ${item.name}: ${item.description}${item.url ? ` (${item.url})` : ''}`
  )
  .join('\n')}

## Software

${software
  .map(
    (item) =>
      `- ${item.name}: ${item.description}${item.url ? ` (${item.url})` : ''}`
  )
  .join('\n')}
`
}

export function getColophonText() {
  return `# Colophon
Route: ${url('/colophon')}

## Technology

${technology
  .map(
    (item) =>
      `- ${item.name}: ${item.description}${item.url ? ` (${item.url})` : ''}`
  )
  .join('\n')}

## Typography

${typography.map((item) => `- ${item.label}`).join('\n')}

## Attribution

${attributions
  .map((item) => `- ${item.name}${item.url ? ` (${item.url})` : ''}`)
  .join('\n')}
`
}
