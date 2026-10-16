import { baseUrl } from '@/constants'
import { socials } from '@/constants/navigation'
import { profile } from '@/constants/portfolio/profile'
import { description, owner, tagline } from '@/constants/site'
import { url } from '@/lib/url'

// Mirrors the copy in src/app/(home)/_components/{hero,about}.tsx and the
// chapters in src/app/(home)/about/_components/story.tsx, which live in JSX.
const story = [
  {
    body: 'It started with Lego sets as a kid: building, breaking and rebuilding whatever I could think of. Nobody taught me, which is still how I learn most things.',
    title: 'Tinkering first',
    when: 'the beginning',
  },
  {
    body: 'The bricks turned into code. Python and some early AI experiments first, then websites and apps, and plenty of bugs that taught me more than any tutorial did.',
    title: 'Then code',
    when: 'python, then the web',
  },
  {
    body: 'Co-authored a research paper with Bosch on [privacy challenges for autonomous vehicles](https://osf.io/preprints/osf/mtfpy_v1). My first time writing for people who check the references.',
    title: 'A paper with Bosch',
    when: '2022',
  },
  {
    body: `Freelance full-stack work for MeetingBaaS: [Transcript Seeker](${url('/projects/transcript_seeker')}), [Speaking Meeting Bot](${url('/projects/speaking_meeting_bot')}) and the AI chat and MCP tooling around their meeting APIs. Then an internship at Energent.ai on the frontend and microservices of an AI data analysis platform.`,
    title: 'Shipping for others',
    when: '2024 to 2025',
  },
  {
    body: 'A student and a Software Engineering Intern at [QuiverAI](https://quiver.ai), a platform for generating, editing and animating SVG graphics with AI. I care about the small details most people never notice but always feel.',
    title: 'These days',
    when: 'now',
  },
]

export function getAboutText() {
  return `# About
Route: ${url('/about')}

${description}

## Intro

${tagline} I design websites and write the code behind them. Right now that means AI products with Next.js, React and TypeScript, as a software engineering intern at QuiverAI.

I'm Anirudh, a full-stack developer who builds practical web apps. I started tinkering with Lego Mindstorms and kept building from there. My stack is Next.js, TypeScript, tRPC, Drizzle, and PostgreSQL. Python was part of my early experiments. I build open-source projects like [AI Tutor](${url('/projects/ai_tutor')}) and [Coolify Tweaks](${url('/projects/coolify_tweaks')}).

## Story
Route: ${url('/about#story')}

${story.map((chapter) => `### ${chapter.title} (${chapter.when})\n\n${chapter.body}`).join('\n\n')}

## Personal Information

- Name: ${owner}
- Location: ${profile.location}
- Pronouns: ${profile.pronouns}
- Website: ${baseUrl.toString()}
- Resume: ${url('/resume')}

## Social Links

${socials.map((item) => `- [${item.name}](${item.url})${item.description ? ` - ${item.description}` : ''}`).join('\n')}
`
}
