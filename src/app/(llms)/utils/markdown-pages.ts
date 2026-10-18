import { getAboutText } from './about'
import { getColophonText } from './colophon'
import { getContactText } from './contact'
import { getExperienceText } from './experience'
import { getSkillsText } from './skills'
import { getTestimonialsText } from './testimonials'
import { getUsesText } from './uses'

interface MarkdownPage {
  getText: () => string
  name: string
  path: string
  summary: string
  title: string
}

export const markdownPages: MarkdownPage[] = [
  {
    getText: getAboutText,
    name: 'about',
    path: '/about.md',
    summary: 'Quick facts, intro, story, location and social links',
    title: 'About',
  },
  {
    getText: getExperienceText,
    name: 'experience',
    path: '/experience.md',
    summary: 'Every role so far, newest first',
    title: 'Experience',
  },
  {
    getText: getSkillsText,
    // TODO(slopradar): unclear-name: one page has three names, 'stack' here (what getPageContent accepts), /skills.md for the route and skills.ts for the builder, pick one
    name: 'stack',
    path: '/skills.md',
    summary: 'The tools I reach for most, by category',
    title: 'Stack',
  },
  {
    getText: getTestimonialsText,
    name: 'testimonials',
    path: '/testimonials.md',
    summary: 'What people say about working with me',
    title: 'Testimonials',
  },
  {
    getText: getUsesText,
    name: 'uses',
    path: '/uses.md',
    summary: 'Hardware, software and editor setup',
    title: 'Uses',
  },
  {
    getText: getColophonText,
    name: 'colophon',
    path: '/colophon.md',
    summary: 'Technology, typography, design and attribution',
    title: 'Colophon',
  },
  {
    getText: getContactText,
    name: 'contact',
    path: '/contact.md',
    summary: 'How to get in touch, plus the FAQ',
    title: 'Contact',
  },
]
