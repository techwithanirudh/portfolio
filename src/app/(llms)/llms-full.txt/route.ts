import { owner, title } from '@/constants/site'
import { getBlogLLMText, getWorkLLMText } from '@/lib/get-llm-text'
import {
  getSortedByDatePosts,
  getSortedWork,
  post,
  workSource,
} from '@/lib/source'
import { getProfileFactsText, getProfileText, getSiteMapText } from '../utils'

async function getFullText() {
  const allPosts = getSortedByDatePosts()
  const allWork = getSortedWork()

  const [workContent, blogContent, profileText] = await Promise.all([
    Promise.all(
      allWork.map((item) => {
        const page = workSource.getPage(item.slugs)
        return page ? getWorkLLMText(page, { level: 'section' }) : ''
      })
    ),
    Promise.all(
      allPosts.map((item) => {
        const page = post.getPage(item.slugs)
        return page ? getBlogLLMText(page, { level: 'section' }) : ''
      })
    ),
    getProfileText(),
  ])

  return `<SYSTEM>This document contains comprehensive information about ${owner}'s professional profile, portfolio, and blog content. It includes quick facts, background, work experience, stack, projects, testimonials, contact options, a site map, and all published blog posts and work projects. This data is formatted for consumption by Large Language Models (LLMs) to provide accurate and up-to-date information about ${owner}'s background, skills, and expertise.</SYSTEM>

# ${title}

${getProfileFactsText()}
${profileText}
${getSiteMapText()}
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
