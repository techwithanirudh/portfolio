import { baseUrl } from '@/constants'
import { socials } from '@/constants/navigation'
import { aboutIntro, heroIntro } from '@/constants/portfolio/intro'
import { profile } from '@/constants/portfolio/profile'
import { story } from '@/constants/portfolio/story'
import { description, owner } from '@/constants/site'
import { absoluteMarkdownLinks, url } from '@/lib/url'

export function getAboutText() {
  return `# About
Route: ${url('/about')}

${description}

## Intro

${absoluteMarkdownLinks(heroIntro)}

${absoluteMarkdownLinks(aboutIntro.join(' '))}

## Story
Route: ${url('/about#story')}

${story.map((chapter) => `### ${chapter.title} (${chapter.when})\n\n${absoluteMarkdownLinks(chapter.body)}`).join('\n\n')}

## Personal information

- Name: ${owner}
- Location: ${profile.location}
- Pronouns: ${profile.pronouns}
- Website: ${baseUrl.toString()}
- Resume: ${url('/resume')}

## Social links

${socials.map((item) => `- [${item.name}](${item.url})${item.description ? `: ${item.description}` : ''}`).join('\n')}
`
}
