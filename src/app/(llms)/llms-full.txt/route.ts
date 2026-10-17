import { owner, title } from '@/constants/site'
import { getBlogLLMText, getWorkLLMText } from '@/lib/get-llm-text'
import { getSortedByDatePosts, getSortedWork } from '@/lib/source'
import { getProfileFactsText, getProfileText, getSiteMapText } from '../utils'

async function getFullText() {
  const allPosts = getSortedByDatePosts()
  const allWork = getSortedWork()

  const [workContent, blogContent, profileText] = await Promise.all([
    Promise.all(
      allWork.map((item) => getWorkLLMText(item, { level: 'section' }))
    ),
    Promise.all(
      allPosts.map((item) => getBlogLLMText(item, { level: 'section' }))
    ),
    getProfileText(),
  ])

  return `<SYSTEM>This document is ${owner}'s whole site in one file for LLMs to read. It has quick facts, background, work experience, stack, projects, testimonials, contact options, a site map, and every published blog post and project.</SYSTEM>

# ${title}

${getProfileFactsText()}
${profileText}
${getSiteMapText()}
## Work

${workContent.join('\n\n')}

## Blog

${blogContent.join('\n\n')}`
}

export const dynamic = 'force-dynamic'

export async function GET() {
  return new Response(await getFullText(), {
    headers: {
      'Content-Type': 'text/markdown;charset=utf-8',
    },
  })
}
