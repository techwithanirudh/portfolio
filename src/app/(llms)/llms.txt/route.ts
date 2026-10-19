import { description, title } from '@/constants/site'
import { url } from '@/lib/url'
import { getContentIndexText } from '../utils/content-index'
import { markdownPages } from '../utils/markdown-pages'
import { staticPages } from '../utils/site-pages'

const content = `# ${title}
> ${description}

For everything in one file, see [llms-full.txt](${url('/llms-full.txt')}).

## Site

${markdownPages.map((page) => `- [${page.title}](${url(page.path)}): ${page.summary}`).join('\n')}

## Pages

${staticPages.map((page) => `- [${page.title}](${url(page.path)}): ${page.description}`).join('\n')}

${getContentIndexText({
  blog: (item) => url(['blog.mdx', ...item.slugs]),
  projects: (item) => url(['work.mdx', ...item.slugs]),
})}`

export const dynamic = 'force-static'

export function GET() {
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
  })
}
