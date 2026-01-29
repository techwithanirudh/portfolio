import { owner, title } from '@/constants/site'
import { getBlogLLMText, getWorkLLMText } from '@/lib/get-llm-text'
import {
  getSortedByDatePosts,
  getSortedByDateWork,
  post,
  workSource,
} from '@/lib/source'
import {
  getAboutText,
  getColophonText,
  getExperienceText,
  getSkillsText,
  getTestimonialsText,
  getUsesText,
} from '../utils'
import { getCommitHistoryText } from '../utils/github-commits'

async function getFullText() {
  const allPosts = getSortedByDatePosts()
  const allWork = getSortedByDateWork()

  const workContent = await Promise.all(
    allWork.map(async (item) => {
      const page = workSource.getPage(item.slugs)
      if (!page) {
        return ''
      }

      const content = await getWorkLLMText(page, { level: 'section' })
      return content
    })
  )

  const blogContent = await Promise.all(
    allPosts.map(async (item) => {
      const page = post.getPage(item.slugs)
      if (!page) {
        return ''
      }

      const content = await getBlogLLMText(page, { level: 'section' })
      return content
    })
  )

  const commitHistory = await getCommitHistoryText();

  return `<SYSTEM>This document contains comprehensive information about ${owner}'s professional profile, portfolio, and blog content. It includes personal details, work experience, technical skills, projects, testimonials, and all published blog posts and work projects. This data is formatted for consumption by Large Language Models (LLMs) to provide accurate and up-to-date information about ${owner}'s background, skills, and expertise.</SYSTEM>

# ${title}

${getAboutText()}
${commitHistory}

${getExperienceText()}

${getSkillsText()}

${getTestimonialsText()}

${getUsesText()}

${getColophonText()}

## Work

${workContent.filter(Boolean).join('\n\n')}

## Blog

${blogContent.filter(Boolean).join('\n\n')}`
}

export const dynamic = 'force-dynamic'

export async function GET() {
  return new Response(await getFullText(), {
    headers: {
      'Content-Type': 'text/markdown;charset=utf-8',
    },
  })
}
