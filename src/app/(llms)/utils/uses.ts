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

// TODO(slopradar): llms-parity: 'photo of my desk setup in 2025' restates the caption in uses/_components/setup.tsx, keep the caption in src/constants/portfolio/uses and read it in both
export function getUsesText() {
  return `# Uses
Route: ${url('/uses')}

${pages.uses.description} The page opens with a photo of my desk setup in 2025.

## Hardware

${listItems(hardware)}

## Software

${listItems(software)}

## Coding

${codingSetup}
`
}
