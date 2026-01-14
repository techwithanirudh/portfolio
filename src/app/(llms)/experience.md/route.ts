import { experiences } from '@/constants/portfolio/experiences'

const content = `# Experience

${experiences
  .map(
    (item) =>
      `## ${item.role} | ${item.company}

Duration: ${item.timeframe}

${item.summary.trim()}`
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
