import { socials } from '@/constants/navigation'
import { faq } from '@/constants/portfolio/faq'
import { url } from '@/lib/url'

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
