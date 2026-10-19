import { pages } from '@/constants/pages'
import { codingSetup, hardware, software } from '@/constants/portfolio/uses'
import { url } from '@/lib/url'

const listItems = (
  items: { description?: string; name: string; url?: string }[]
) =>
  items
    .map(
      (item) =>
        `- ${item.name}${item.description ? `: ${item.description}` : ''}${item.url ? ` (${item.url})` : ''}`
    )
    .join('\n')

export function getUsesText() {
  return `# Uses
Route: ${url(pages.uses.path)}

${pages.uses.description} The page opens with a photo of my desk setup in 2025.

## Hardware

${listItems(hardware)}

## Software

${listItems(software)}

## Coding

${codingSetup}
`
}
