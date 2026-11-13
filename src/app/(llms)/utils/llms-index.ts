import { description, title } from '@/constants/site'
import { url } from '@/lib/url'
import { getContentIndexText } from './content-index'
import { markdownPages } from './markdown-pages'
import { staticPages } from './site-pages'

/** The llms.txt index: every markdown page, site page, post and project with a link */
export const getLlmsIndexText = () => `# ${title}
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
