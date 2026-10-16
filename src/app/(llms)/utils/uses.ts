import { hardware, software } from '@/constants/portfolio/uses'
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
Route: ${url('/uses')}

The hardware and software I use every day. The page opens with a photo of my desk setup in 2025.

## Hardware

${listItems(hardware)}

## Software

${listItems(software)}

## Coding

I use [Visual Studio Code](https://code.visualstudio.com) as my main editor with the [Cursor theme](https://marketplace.visualstudio.com/items?itemName=MohdZaid.vscode-cursor-theme), [Custom UI Style](https://marketplace.visualstudio.com/items?itemName=subframe7536.custom-ui-style) tweaks, and the [JetBrains Mono](https://www.jetbrains.com/lp/mono/) font with ligatures enabled. The config lives in [my dotfiles](https://github.com/techwithanirudh/dotfiles/blob/main/editors/vscode/settings.json).
`
}
