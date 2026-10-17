import {
  attributions,
  technology,
  typography,
} from '@/constants/portfolio/colophon'
import { url } from '@/lib/url'

export function getColophonText() {
  return `# Colophon
Route: ${url('/colophon')}

The tools, fonts, and people behind this website.

## Technology

${technology
  .map(
    (item) =>
      `- ${item.name}: ${item.description}${item.url ? ` (${item.url})` : ''}`
  )
  .join('\n')}

## Typography

${typography.map((item) => `- ${item.label}`).join('\n')}

## Design and colors

The layout uses wide spacing and dashed borders. Geist Sans sets headings and body text, and Geist Mono sets code and labels. The palette is neutral, with a blue accent for focus rings and links.

## Attribution

${attributions
  .map((item) => `- ${item.name}${item.url ? ` (${item.url})` : ''}`)
  .join('\n')}
`
}
