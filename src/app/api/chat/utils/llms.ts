import {
  getAboutText,
  getColophonText,
  getExperienceText,
  getSkillsText,
  getTestimonialsText,
  getUsesText,
} from '@/app/(llms)/utils'
import { getCommitHistoryText } from '@/app/(llms)/utils/github-commits'
import { description, title } from '@/constants/site'
import { getSortedByDatePosts, getSortedWork } from '@/lib/source'
import { url } from '@/lib/url'

export async function getLLMsTxt() {
  const allPosts = getSortedByDatePosts()
  const allWork = getSortedWork()
  const commitHistory = await getCommitHistoryText()

  return `# ${title}
> ${description}

${getAboutText()}
${commitHistory}

${getExperienceText()}

${getSkillsText()}

${getTestimonialsText()}

${getUsesText()}

${getColophonText()}

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
