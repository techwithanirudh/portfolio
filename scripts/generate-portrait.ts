import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const SOURCE = path.join(process.cwd(), 'public/images/portrait.svg')
// TODO(slopradar): duplication: the output path is repeated in the `generate-portrait` script of package.json (for the `biome format` step), format from here (`Bun.spawn` or put the formatting in the template) or export the path so it lives once
const TARGET = path.join(
  process.cwd(),
  'src/app/(home)/_components/portrait-face.tsx'
)
const ID_PREFIX = 'portrait-'

const svgBody = /<svg[^>]*>([\s\S]*)<\/svg>/
const xmlComment = /<!--[\s\S]*?-->/g
const kebabAttribute = / ([a-z]+)-([a-z])([a-z]*)=/g
const idAttribute = / id="([^"]+)"/g
const urlReference = /url\(#([^)]+)\)/g
const hrefReference = / href="#([^"]+)"/g

const source = await readFile(SOURCE, 'utf8')
const body = svgBody.exec(source)?.[1]
if (!body) {
  throw new Error(`No <svg> element found in ${SOURCE}`)
}

const jsx = body
  .replace(xmlComment, '')
  .replace(
    kebabAttribute,
    (_, head: string, first: string, rest: string) =>
      ` ${head}${first.toUpperCase()}${rest}=`
  )
  .replace(idAttribute, ` id="${ID_PREFIX}$1"`)
  .replace(urlReference, `url(#${ID_PREFIX}$1)`)
  .replace(hrefReference, ` href="#${ID_PREFIX}$1"`)
  .trim()

await writeFile(
  TARGET,
  `// Generated from public/images/portrait.svg by \`bun run generate-portrait\`.
// Do not edit by hand.

export const PortraitFace = () => (
  <>
    ${jsx}
  </>
)
`
)
