import type { StoryChapter } from '@/types'

export const story: StoryChapter[] = [
  {
    body: 'It started with Lego sets as a kid. I built, broke and rebuilt whatever I could think of. Nobody taught me, which is still how I learn most things.',
    icon: 'wrench',
    id: 'tinkering',
    photo: {
      alt: 'LEGO Boost robot, Vernie',
      caption: 'lego boost',
      letterbox: 'bg-white',
      src: '/images/about/lego-boost.webp',
    },
    title: 'Tinkering first',
    when: 'the beginning',
  },
  {
    body: 'From bricks to code. I picked up Python around 2020 and spent a while tinkering with AI: TensorFlow, image classifiers, GPT-2, deepfakes and face swaps.',
    id: 'python',
    photo: {
      alt: 'Before and after of a face swap on AI-generated portraits',
      caption: 'a face swap',
      src: '/images/about/face-swap-demo.webp',
    },
    title: 'Then Python',
    when: 'python, then ml',
  },
  {
    body: 'After the ML phase I went on a web dev journey: a pile of plain HTML experiments, then [Daily Diary](/projects/daily_diary), a journal app, and [AniKode](/projects/anikode), a drag-and-drop website builder.',
    icon: 'codeXml',
    id: 'code',
    photo: {
      alt: 'The original AniKode landing page, with the headline Simplify the way you build websites',
      caption: 'anikode',
      src: '/images/about/anikode-landing.webp',
    },
    title: 'Then the web',
    when: 'the web',
  },
  {
    body: 'I co-authored a research paper with Bosch on [privacy challenges for autonomous vehicles](https://osf.io/preprints/osf/mtfpy_v1).',
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
    body: 'Then LLMs showed up. I started with a ChatGPT-style chat app, then built [AI Tutor](/projects/ai_tutor), a study app with quizzes and voice sessions.',
    id: 'llms',
    photo: {
      alt: 'The AI Tutor sign-in screen on a phone',
      caption: 'ai tutor',
      src: '/images/about/ai-tutor-login.webp',
    },
    title: 'Then LLMs',
    when: 'llms',
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
    body: "I'm a software engineering intern at [QuiverAI](https://quiver.ai), a platform for generating, editing and animating SVG graphics with AI.",
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
