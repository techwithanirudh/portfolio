import { format } from 'date-fns'
import { baseUrl } from '@/constants'
import { experiences } from '@/constants/portfolio/experiences'
import { skills } from '@/constants/portfolio/skills'
import { testimonials } from '@/constants/portfolio/testimonials'
import { description, owner, title } from '@/constants/site'
import { socials } from '@/constants/social'
import { getBlogLLMText, getWorkLLMText } from '@/lib/get-llm-text'
import {
  getSortedByDatePosts,
  getSortedByDateWork,
  post,
  workSource,
} from '@/lib/source'
import { url } from '@/lib/url'

const allPosts = getSortedByDatePosts()
const allWork = getSortedByDateWork()

const aboutText = `## About

${description}

### Personal Information

- Name: ${owner}
- Display Name: ${title}
- Website: ${baseUrl.toString()}

### Social Links

${socials.map((item) => `- [${item.name}](${item.url})${item.description ? ` - ${item.description}` : ''}`).join('\n')}
`

const experienceText = `## Experience

${experiences
  .map(
    (item) =>
      `### ${item.role} | ${item.company}

Duration: ${item.timeframe}

${item.summary.trim()}`
  )
  .join('\n\n')}
`

const skillsText = `## Skills & Expertise

${skills
  .map(
    (item) =>
      `### ${item.title}

${item.description}`
  )
  .join('\n\n')}
`

const testimonialsText = `## Testimonials

${testimonials
  .map(
    (item) =>
      `### ${item.title}

> ${item.description}

— **${item.author.name}**`
  )
  .join('\n\n')}
`

async function getWorkContent() {
  const text = await Promise.all(
    allWork.map(async (item) => {
      const page = workSource.getPage(item.slugs)
      if (!page) {
        return ''
      }

      const content = await getWorkLLMText(page)
      return `---\ntitle: "${item.data.title}"\ndescription: "${item.data.description ?? ''}"\nlast_updated: "${item.data.lastModified ? format(new Date(item.data.lastModified), 'MMMM d, yyyy') : 'N/A'}"\nsource: "${url(item.url)}"\n---\n\n${content}`
    })
  )
  return text.filter(Boolean).join('\n\n')
}

async function getBlogContent() {
  const text = await Promise.all(
    allPosts.map(async (item) => {
      const page = post.getPage(item.slugs)
      if (!page) {
        return ''
      }

      const content = await getBlogLLMText(page)
      return `---\ntitle: "${item.data.title}"\ndescription: "${item.data.description ?? ''}"\ntags: "${item.data.tags?.join(', ') ?? ''}"\nlast_updated: "${item.data.lastModified ? format(new Date(item.data.lastModified), 'MMMM d, yyyy') : 'N/A'}"\nsource: "${url(item.url)}"\n---\n\n${content}`
    })
  )
  return text.filter(Boolean).join('\n\n')
}

async function getContent() {
  return `<SYSTEM>This document contains comprehensive information about ${owner}'s professional profile, portfolio, and blog content. It includes personal details, work experience, technical skills, projects, testimonials, and all published blog posts and work projects. This data is formatted for consumption by Large Language Models (LLMs) to provide accurate and up-to-date information about ${owner}'s background, skills, and expertise.</SYSTEM>

# ${title}

> ${description}

${aboutText}
${experienceText}
${skillsText}
${testimonialsText}

## Work

${await getWorkContent()}

## Blog

${await getBlogContent()}`
}

export const dynamic = 'force-static'

export async function GET() {
  return new Response(await getContent(), {
    headers: {
      'Content-Type': 'text/markdown;charset=utf-8',
    },
  })
}
