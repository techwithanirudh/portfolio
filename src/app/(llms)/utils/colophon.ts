import { pages } from '@/constants/pages'
import {
  attributionIntro,
  attributions,
  designInspiration,
  designNotes,
  technology,
  typography,
  typographyIntro,
} from '@/constants/portfolio/colophon'
import { url } from '@/lib/url'

export function getColophonText() {
  return `# Colophon
Route: ${url(pages.colophon.path)}

${pages.colophon.description}

## Technology

${technology
  .map(
    (item) =>
      `- ${item.name}: ${item.description}${item.url ? ` (${item.url})` : ''}`
  )
  .join('\n')}

## Typography

${typographyIntro}

${typography.map((item) => `- ${item.label}`).join('\n')}

## Design and colors

${designNotes.layout} ${designNotes.palette}

## Attribution

${attributionIntro} Some design ideas also come from [${designInspiration.name}](${designInspiration.url}).

${attributions
  .map((item) => `- ${item.name}${item.url ? ` (${item.url})` : ''}`)
  .join('\n')}
`
}
