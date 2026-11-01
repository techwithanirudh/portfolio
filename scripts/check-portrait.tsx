import { readFile } from 'node:fs/promises'
import { renderToStaticMarkup } from 'react-dom/server'
import { PortraitFace } from '@/components/portrait/portrait-face'

const svgBody = /<svg[^>]*>([\s\S]*)<\/svg>/
const xmlComment = /<!--[\s\S]*?-->/g
const tag = /<(\/?)([\w:]+)([^>]*?)(\/?)>/g
const attribute = /([\w:-]+)="([^"]*)"/g

const canonical = (markup: string) =>
  [...markup.replace(xmlComment, '').matchAll(tag)]
    .flatMap(([, close, name, attrs = '', selfClose]) => {
      if (close) {
        return [`/${name}`]
      }
      const open = [
        name,
        ...[...attrs.matchAll(attribute)]
          .map(([, key, value]) => `${key}=${value}`)
          .sort(),
      ].join(' ')
      return selfClose ? [open, `/${name}`] : [open]
    })
    .join('\n')

const svg = await readFile('public/images/portrait.svg', 'utf8')
const expected = canonical(svgBody.exec(svg)?.[1] ?? '')
const actual = canonical(
  renderToStaticMarkup(
    <svg>
      <PortraitFace />
    </svg>
  ).replaceAll('portrait-', '')
)

if (actual !== `svg\n${expected}\n/svg`) {
  console.error(
    'src/components/portrait/portrait-face.tsx no longer matches public/images/portrait.svg'
  )
  process.exit(1)
}
