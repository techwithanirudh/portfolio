import {
  getAboutText,
  getColophonText,
  getExperienceText,
  getSkillsText,
  getTestimonialsText,
  getUsesText,
} from '@/app/(llms)/utils'
import { getCommitHistoryText } from '@/app/(llms)/utils/github-commits'
import { getGuestbookText } from '@/app/(llms)/utils/guestbook'
import { description, title } from '@/constants/site'
import { getSortedByDatePosts, getSortedByDateWork } from '@/lib/source'
import { url } from '@/lib/url'

export async function getLLMsTxt() {
  const allPosts = getSortedByDatePosts()
  const allWork = getSortedByDateWork()
  const [guestbook, commitHistory] = await Promise.all([
    getGuestbookText(),
    getCommitHistoryText(),
  ])

  return `# ${title}
> ${description}

${getAboutText()}
${commitHistory}

${getExperienceText()}

${getSkillsText()}

${getTestimonialsText()}

${getUsesText()}

${getColophonText()}
${guestbook}

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
