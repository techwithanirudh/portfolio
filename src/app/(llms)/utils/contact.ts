import { socials } from '@/constants/navigation'
import { faq } from '@/constants/portfolio/faq'
import { url } from '@/lib/url'

// TODO(slopradar): llms-parity: the intro restates contact/_components/hero.tsx by hand ('reply within a week'), keep it in one constant (for example pages.contact.summary) and read it in both
export function getContactText() {
  return `# Contact
Route: ${url('/contact')}

Have a question or want to work together? Send a message through the contact form and I'll reply within a week. Visitors can also leave a public note in the [guestbook](${url('/guestbook')}).

## Links

${socials.map((item) => `- [${item.name}](${item.url})`).join('\n')}

## FAQ

${faq.map((item) => `### ${item.question}\n\n${item.answer}`).join('\n\n')}
`
}
