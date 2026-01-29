import { testimonials } from '@/constants/portfolio/testimonials'
import { url } from '@/lib/url'

export function getTestimonialsText() {
  return `# Testimonials
Route: ${url('/about')}

${testimonials
  .map(
    (item) =>
      `## ${item.title}

> ${item.description}

— **${item.author.name}**`
  )
  .join('\n\n')}
`
}
