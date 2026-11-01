import { owner, title } from '@/constants/site'
import { getBlogLLMText, getProjectLLMText } from '@/lib/get-llm-text'
import { getSortedByDatePosts, getSortedProjects } from '@/lib/source'
import { markdownResponse } from '../utils/markdown-response'
import { getProfileFactsText } from '../utils/profile'
import { getSiteMapText } from '../utils/site-pages'
import { getSiteText } from '../utils/site-text'

async function getFullText() {
  const allPosts = getSortedByDatePosts()
  const allProjects = getSortedProjects()

  const [projectContent, blogContent, profileText] = await Promise.all([
    Promise.all(
      allProjects.map((item) => getProjectLLMText(item, { level: 'section' }))
    ),
    Promise.all(
      allPosts.map((item) => getBlogLLMText(item, { level: 'section' }))
    ),
    getSiteText(),
  ])

  return `<SYSTEM>This document is ${owner}'s whole site in one file for LLMs to read. It has quick facts, background, work experience, stack, projects, testimonials, contact options, a site map, and every published blog post and project.</SYSTEM>

# ${title}

${getProfileFactsText()}
${profileText}
${getSiteMapText()}
## Projects

${projectContent.join('\n\n')}

## Blog

${blogContent.join('\n\n')}`
}

export const dynamic = 'force-dynamic'

export async function GET() {
  return markdownResponse(await getFullText())
}
