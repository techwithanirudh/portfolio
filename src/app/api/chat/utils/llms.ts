import { description, title } from '@/constants/site'
import { getSortedByDatePosts, getSortedByDateWork } from '@/lib/source'
import { url } from '@/lib/url'

export function getLLMsTxt() {
  const allPosts = getSortedByDatePosts()
  const allWork = getSortedByDateWork()

  return `# ${title}
> ${description}

**Note:** For a comprehensive single-file version with all content, see [llms-full.txt](${url('/llms-full.txt')})

## About Me

- [About](${url('/about.md')}): Personal information, tech stack, and how to connect
- [Experience](${url('/experience.md')}): Career timeline and key roles
- [Skills](${url('/skills.md')}): Technical expertise and focus areas
- [Testimonials](${url('/testimonials.md')}): What people say about working with me

## Work

${allWork
  .map(
    (item) =>
      `- [${item.data.title}](${url(['work.mdx', ...item.slugs])}): ${item.data.description ?? 'Project showcase'}`
  )
  .join('\n')}

## Blog

${allPosts
  .map(
    (item) =>
      `- [${item.data.title}](${url(['blog.mdx', ...item.slugs])}): ${item.data.description ?? ''}`
  )
  .join('\n')}
`
}
