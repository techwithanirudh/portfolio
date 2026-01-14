import { skills } from '@/constants/portfolio/skills'

const content = `# Skills & Expertise

${skills
  .map(
    (item) =>
      `## ${item.title}

${item.description}`
  )
  .join('\n\n')}
`

export const dynamic = 'force-static'

export function GET() {
  return new Response(content, {
    headers: {
      'Content-Type': 'text/markdown;charset=utf-8',
    },
  })
}
