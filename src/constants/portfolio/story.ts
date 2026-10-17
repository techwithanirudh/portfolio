import type { StoryChapter } from '@/types'

export const story: StoryChapter[] = [
  {
    body: 'It started with Lego sets as a kid. I built, broke and rebuilt whatever I could think of. Nobody taught me, which is still how I learn most things.',
    icon: 'wrench',
    id: 'tinkering',
    photo: {
      alt: 'A Mario clone, one of the first games I built',
      caption: 'a mario clone',
      src: '/images/projects/animariogame/cover.jpg',
    },
    title: 'Tinkering first',
    when: 'the beginning',
  },
  {
    body: 'Then I moved from bricks to code. I started with Python and some early AI experiments, then built websites and apps, and hit plenty of bugs that taught me more than any tutorial did.',
    icon: 'codeXml',
    id: 'code',
    photo: {
      alt: 'Maskio, a pixel art platformer',
      caption: 'maskio',
      src: '/images/projects/maskio/cover.jpg',
    },
    title: 'Then code',
    when: 'python, then the web',
  },
  {
    body: 'I co-authored a research paper with Bosch on [privacy challenges for autonomous vehicles](https://osf.io/preprints/osf/mtfpy_v1). It was my first time writing for people who check the references.',
    id: 'bosch',
    photo: {
      alt: 'Bosch',
      caption: 'the paper',
      contain: true,
      src: '/images/companies/bosch.png',
    },
    title: 'A paper with Bosch',
    when: '2022',
  },
  {
    body: 'I did freelance full-stack work for MeetingBaaS, building [Transcript Seeker](/projects/transcript_seeker), [Speaking Meeting Bot](/projects/speaking_meeting_bot) and the AI chat and MCP tooling around their meeting APIs. Then I interned at [Energent.ai](https://energent.ai), working on the frontend and microservices of their AI data analysis platform.',
    id: 'shipping',
    photo: {
      alt: 'Transcript Seeker',
      caption: 'transcript seeker',
      letterbox: 'bg-[#2b2b2b]',
      src: '/images/projects/transcript_seeker/cover.png',
    },
    title: 'Shipping for others',
    when: '2024 to 2025',
  },
  {
    body: "I'm a student and a software engineering intern at [QuiverAI](https://quiver.ai), a platform for generating, editing and animating SVG graphics with AI. I care about the small details most people never notice.",
    id: 'now',
    photo: {
      alt: 'QuiverAI',
      caption: 'quiver',
      contain: true,
      src: '/images/companies/quiverai.png',
    },
    title: 'These days',
    when: 'now',
  },
]
