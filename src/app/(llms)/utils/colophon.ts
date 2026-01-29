import {
  attributions,
  technology,
  typography,
} from '@/constants/portfolio/colophon'
import { url } from '@/lib/url'

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
