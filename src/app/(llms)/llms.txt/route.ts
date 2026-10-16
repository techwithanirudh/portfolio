import { description, title } from '@/constants/site'
import { getSortedByDatePosts, getSortedWork } from '@/lib/source'
import { url } from '@/lib/url'
import { staticPages } from '../utils/site-pages'

const allPosts = getSortedByDatePosts()
const allWork = getSortedWork()

const content = `# ${title}
> ${description}

**Note:** For a comprehensive single-file version with all content, see [llms-full.txt](${url('/llms-full.txt')})

## Site

- [About](${url('/about.md')}): Quick facts, intro, story, location and social links
- [Experience](${url('/experience.md')}): Every role so far, newest first
- [Stack](${url('/skills.md')}): The tools I reach for most, by category
- [Testimonials](${url('/testimonials.md')}): What people say about working with me
- [Uses](${url('/uses.md')}): Hardware, software and editor setup
- [Colophon](${url('/colophon.md')}): Technology, typography, design and attribution
- [Contact](${url('/contact.md')}): How to get in touch, plus the FAQ

## Pages

${staticPages.map((page) => `- [${page.title}](${url(page.path)}): ${page.description}`).join('\n')}

## Work

${allWork.map((item) => `- [${item.data.title}](${url(['work.mdx', ...item.slugs])}): ${item.data.description ?? 'Project showcase'}`).join('\n')}

## Blog

${allPosts.map((item) => `- [${item.data.title}](${url(['blog.mdx', ...item.slugs])}): ${item.data.description ?? ''}`).join('\n')}
`

export const dynamic = 'force-static'
export const revalidate = false

export function GET() {
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
  })
}
