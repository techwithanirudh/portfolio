import { description, title } from '@/constants/site'
import { getSortedByDatePosts, getSortedByDateWork } from '@/lib/source'
import { url } from '@/lib/url'

const allPosts = getSortedByDatePosts()
const allWork = getSortedByDateWork()

const content = `# ${title}
> ${description}

**Note:** For a comprehensive single-file version with all content, see [llms-full.txt](${url('/llms-full.txt')})

## About Me

- [About](${url('/about')}): Personal information, tech stack, and how to connect
- [Experience](${url('/about')}): Career timeline and key roles
- [Skills](${url('/about')}): Technical expertise and focus areas
- [Testimonials](${url('/')}): What people say about working with me

## Site

- [Uses](${url('/uses.md')}): Hardware and software in the setup
- [Colophon](${url('/colophon.md')}): Technology, typography, and attribution

## Work

${allWork.map((item) => `- [${item.data.title}](${url(['work.mdx', ...item.slugs])}): ${item.data.description ?? 'Project showcase'}`).join('\n')}

## Blog

${allPosts.map((item) => `- [${item.data.title}](${url(['blog.mdx', ...item.slugs])}): ${item.data.description ?? ''}`).join('\n')}
`

export const dynamic = 'force-static'

export function GET() {
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
  })
}
