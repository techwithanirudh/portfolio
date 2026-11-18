import { pages } from '@/constants/pages'
import {
  testimonials,
  testimonialsIntro,
} from '@/constants/portfolio/testimonials'
import { url } from '@/lib/url'

export function getTestimonialsText() {
  return `# Testimonials
Route: ${url(pages.home.path)}

## ${testimonialsIntro.title}

${testimonialsIntro.description}

${testimonials
  .map(
    (item) =>
      `### ${item.title}

> ${item.description}

**${item.author.name}**`
  )
  .join('\n\n')}
`
}
