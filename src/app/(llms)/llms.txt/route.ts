import { title } from '@/constants/site'
import { getSortedByDatePosts, getSortedByDateWork } from '@/lib/source'
import { url } from '@/lib/url'

const allPosts = getSortedByDatePosts()
const allWork = getSortedByDateWork()

const content = `# ${title}

> Developer who builds cool web and AI things, always learning and exploring.

**Note:** For a comprehensive single-file version with all content, see [llms-full.txt](${url('/llms-full.txt')})

## About Me

- [About](${url('/about.md')}): Personal information, tech stack, and how to connect
- [Experience](${url('/experience.md')}): Career timeline and key roles
- [Skills](${url('/skills.md')}): Technical expertise and focus areas
- [Testimonials](${url('/testimonials.md')}): What people say about working with me

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
