import { socials } from '@/constants/navigation'
import { aboutIntro, heroIntro } from '@/constants/portfolio/intro'
import { profile } from '@/constants/portfolio/profile'
import { story } from '@/constants/portfolio/story'
import { description, owner } from '@/constants/site'
import { baseUrl } from '@/lib/metadata'
import { absoluteMarkdownLinks, url } from '@/lib/url'

export function getAboutText() {
  // TODO(slopradar): magic-string: route paths are typed by hand ('/about', '/about#story', '/resume' here, and in colophon, contact, experience, skills, testimonials, uses and profile.ts) while sitemap.ts reads pages.<key>.path, interpolate the pages constant
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
