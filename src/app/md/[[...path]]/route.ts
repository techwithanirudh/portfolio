import { heroIntro } from '@/constants/portfolio/intro'
import { description, title } from '@/constants/site'
import { url } from '@/lib/url'
import { getLlmsIndexText } from '../../(llms)/utils/llms-index'
import { markdownResponse } from '../../(llms)/utils/markdown-response'
import { getSitePages } from '../../(llms)/utils/site-pages'
import { getPageMarkdown } from '../../(llms)/utils/site-path'

export const dynamic = 'force-dynamic'

const homeMarkdown = () =>
  `${[`# ${title}`, `> ${description}`, heroIntro].join('\n\n')}\n\n${getLlmsIndexText()
    .split('\n')
    .slice(3)
    .join('\n')}`

const notFoundMarkdown = (path: string) =>
  [
    '# Not found',
    `There is no page at \`${path}\` on this site.`,
    `Start from the [site index](${url('/llms.txt')}) or the [sitemap](${url('/sitemap.xml')}) to find what you are looking for.`,
  ].join('\n\n')

/**
 * Where proxy.ts sends requests that ask for Accept: text/markdown. The path
 * after /md is the page that was asked for.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const { path: segments = [] } = await params
  const path = `/${segments.join('/')}`

  if (path === '/') {
    return markdownResponse(homeMarkdown())
  }

  const markdown = await getPageMarkdown(path)
  if (markdown) {
    return markdownResponse(markdown)
  }

  const page = getSitePages().find((entry) => entry.path === path)
  if (page) {
    return markdownResponse(
      `# ${page.title}\n\n${page.description}\n\nOpen [${url(page.path)}](${url(page.path)}) for the full page.`
    )
  }

  return markdownResponse(notFoundMarkdown(path), 404)
}
