import { testimonials } from '@/constants/portfolio/testimonials'
import { url } from '@/lib/url'

// TODO(slopradar): llms-parity: the section title 'What others are saying' and its intro line live only in (home)/_components/testimonials.tsx, move them into src/constants/portfolio/testimonials and read them in both
export function getTestimonialsText() {
  return `# Testimonials
Route: ${url('/')}

${testimonials
  .map(
    (item) =>
      `## ${item.title}

> ${item.description}

**${item.author.name}**`
  )
  .join('\n\n')}
`
}
