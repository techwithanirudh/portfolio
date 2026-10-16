import { getProfileText, getSiteMapText } from '@/app/(llms)/utils'
import { description, title } from '@/constants/site'
import { getSortedByDatePosts, getSortedWork } from '@/lib/source'

export async function getLLMsTxt() {
  return `# ${title}
> ${description}

${await getProfileText()}
${getSiteMapText()}
## Work

${getSortedWork()
  .map(
    (item) =>
      `- [${item.data.title}](${item.url}): ${item.data.description ?? 'Project showcase'}`
  )
  .join('\n')}

## Blog

${getSortedByDatePosts()
  .map(
    (item) =>
      `- [${item.data.title}](${item.url}): ${item.data.description ?? ''}`
  )
  .join('\n')}
`
}
