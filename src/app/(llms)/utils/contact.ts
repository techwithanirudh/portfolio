import { socials } from '@/constants/navigation'
import { pages } from '@/constants/pages'
import { faq } from '@/constants/portfolio/faq'
import { contactIntro } from '@/constants/portfolio/intro'
import { url } from '@/lib/url'

export function getContactText() {
  return `# Contact
Route: ${url(pages.contact.path)}

${contactIntro}

## Links

${socials.map((item) => `- [${item.name}](${item.url})`).join('\n')}

## FAQ

${faq.map((item) => `### ${item.question}\n\n${item.answer}`).join('\n\n')}
`
}
