import { hardware, software } from '@/constants/portfolio/uses'
import { url } from '@/lib/url'

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
