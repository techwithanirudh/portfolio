import { testimonials } from '@/constants/portfolio/testimonials'

const content = `# Testimonials

${testimonials
  .map(
    (item) =>
      `## ${item.title}

> ${item.description}

— **${item.author.name}**`
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
