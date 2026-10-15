/**
 * Facts every design variant reads from, so the four prototypes compare
 * layouts and not copy. Real data stays in `@/constants` and `@/lib/source`;
 * this file only adds what the variants need on top (grouping, chapters).
 */
import { socials } from '@/constants/navigation'
import { experiences } from '@/constants/portfolio/experiences'
import { testimonials } from '@/constants/portfolio/testimonials'
import { description, owner } from '@/constants/site'
import { getSortedByDatePosts, getSortedWork } from '@/lib/source'

export const profile = {
  avatar: '/images/profile.png',
  current: {
    company: 'QuiverAI',
    title: 'Software Engineering Intern',
    url: 'https://quiver.ai',
  },
  description,
  email: 'hello@techwithanirudh.com',
  github: 'techwithanirudh',
  handle: 'an1rudh',
  location: 'India',
  name: owner,
  role: 'Design engineer',
  socials: socials.map(({ name, url }) => ({ name, url })),
  timeZone: 'Asia/Kolkata',
} as const

export type ExperienceKind = 'work' | 'freelance' | 'research' | 'personal'

const kindById: Record<string, ExperienceKind> = {
  bosch: 'research',
  energent: 'work',
  meetingbaas: 'freelance',
  quiverai: 'work',
}

export const experienceKinds: { kind: ExperienceKind; label: string }[] = [
  { kind: 'work', label: 'Work' },
  { kind: 'freelance', label: 'Freelance' },
  { kind: 'research', label: 'Research' },
  { kind: 'personal', label: 'Personal' },
]

/** Each employer tagged with a kind, so variants can group them. */
export const groupedExperience = experienceKinds.map(({ kind, label }) => ({
  items: experiences.filter((e) => (kindById[e.id] ?? 'personal') === kind),
  kind,
  label,
}))

/** Strips `[text](url)` Markdown links down to their text. */
export const plain = (text = '') => text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

/**
 * The journey, oldest first. Years and facts come from the experience data;
 * the prose is a first draft for Anirudh to rewrite in his own voice.
 */
export const chapters = [
  {
    body: 'It started with Lego sets: building, breaking and rebuilding them. Mindstorms and Lego Boost turned that into programming: a snake, Vernie, a humanoid robot and a gripper.',
    id: 'lego',
    title: 'Lego, then robots',
    years: '2018 – 2019',
  },
  {
    body: 'Python came next, and with it early AI experiments in Keras, OpenCV and TensorFlow. Most of them failed in instructive ways.',
    id: 'python',
    title: 'Teaching a computer to see',
    years: '2019 – 2020',
  },
  {
    body: 'Websites and PowerApps, a Product Hunt launch, and Maskio, a pixel-art platformer for the GitHub Game Jam. The first time people I did not know used something I made.',
    id: 'web',
    title: 'Shipping to strangers',
    years: '2020 – 2021',
  },
  {
    body: 'Next.js, databases, auth and deploys. Templates like Shadcn Portfolio and Coolify Tweaks, then AI apps and agents.',
    id: 'fullstack',
    title: 'Full stack, and open source',
    years: '2021 – now',
  },
  {
    body: 'A research paper with Bosch on privacy for autonomous driving, freelance work for MeetingBaaS, an internship at Energent.ai, and now QuiverAI, where AI draws and animates SVGs.',
    id: 'teams',
    title: 'Building with teams',
    years: '2022 – now',
  },
] as const

export const getWork = () =>
  getSortedWork().map((page) => ({
    date: page.data.date,
    description: page.data.description ?? '',
    github: page.data.github,
    image: page.data.image,
    pinned: page.data.order !== undefined,
    slug: page.slugs.join('/'),
    tags: page.data.tags ?? [],
    title: page.data.title ?? 'Untitled',
    url: page.url,
    website: page.data.website,
    year: page.data.date.getFullYear(),
  }))

export const getWriting = () =>
  getSortedByDatePosts().map((page) => ({
    date: page.data.date,
    description: page.data.description ?? '',
    image: page.data.image,
    title: page.data.title ?? 'Untitled',
    url: page.url,
  }))

export { experiences, testimonials }
