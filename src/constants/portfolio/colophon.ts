import type {
  AttributionItem,
  TechnologyItem,
  TypographyItem,
} from '@/types/colophon'

export const technology = [
  {
    description: 'App Router with server components and streaming.',
    name: 'Next.js',
    url: 'https://nextjs.org',
  },
  {
    description: 'Strict mode across the whole codebase.',
    name: 'TypeScript',
    url: 'https://www.typescriptlang.org',
  },
  {
    description: 'Utility-first styling with custom design tokens.',
    name: 'Tailwind CSS',
    url: 'https://tailwindcss.com',
  },
  {
    description: 'Typed MDX content, search and the docs layouts.',
    name: 'Fumadocs',
    url: 'https://fumadocs.dev',
  },
  {
    description: 'Accessible components that I restyled for this site.',
    name: 'Base UI',
    url: 'https://base-ui.com',
  },
  {
    description: 'Relational database that stores the site data.',
    name: 'PostgreSQL',
    url: 'https://www.postgresql.org',
  },
  {
    description: 'Type-safe queries and schema management.',
    name: 'Drizzle ORM',
    url: 'https://orm.drizzle.team',
  },
  {
    description: 'Reveal and transition animations.',
    name: 'Motion',
    url: 'https://motion.dev',
  },
  {
    description: 'Runtime, bundler and package manager in one.',
    name: 'Bun',
    url: 'https://bun.sh',
  },
] satisfies TechnologyItem[]

export const attributions = [
  { name: 'Braydon Coyer', url: 'https://www.braydoncoyer.dev' },
  { name: 'Nelson Lai', url: 'https://nelsonlai.dev' },
  { name: 'Chanh Dai', url: 'https://chanhdai.com' },
  { name: 'Tailwind CSS', url: 'https://tailwindcss.com' },
  { name: 'Tiptap', url: 'https://tiptap.dev' },
  { name: 'Hexaa', url: 'https://hexaa.sh' },
  { name: 'Josh W. Comeau', url: 'https://www.joshwcomeau.com' },
  { name: 'Ingo', url: 'https://ingo.au' },
  { name: 'Rafael Camargo', url: 'https://cmrg.me' },
  { name: 'Shu Ding', url: 'https://shud.in' },
  { name: 'Emil Kowalski', url: 'https://emilkowal.ski' },
  { name: 'shadcn/ui', url: 'https://ui.shadcn.com' },
  { name: 'Steve', url: 'https://iamsteve.me' },
  { name: 'Visitors', url: 'https://visitors.now' },
  { name: 'Ephraim Duncan', url: 'https://ephraimduncan.com/' },
  { name: 'Suraj Gaud', url: 'https://www.surajgaud.com/' },
  { name: 'Kinfish', url: 'https://kinfish.farmui.com/' },
  { name: 'Enscribe', url: 'https://enscribe.dev/' },
  { name: 'Lean Rada', url: 'https://leanrada.com/' },
  { name: 'Victor Eke', url: 'https://victoreke.com/' },
  { name: 'Noah Dunnagan', url: 'https://noahdunnagan.com/' },
] satisfies AttributionItem[]

export const designNotes = {
  layout:
    'The layout uses wide spacing and dashed borders. Geist Sans sets headings and body text, and Geist Mono sets code and labels.',
  palette:
    'The palette is neutral, with a blue accent for focus rings and links.',
}

export const attributionIntro =
  'I borrowed code and design ideas from these people.'

export const designInspiration = {
  name: 'Godly',
  url: 'https://godly.website/',
}

export const typographyIntro =
  'Geist Sans sets most of the interface, and Geist Mono sets code and labels.'

export const typography = [
  { className: 'font-normal', label: 'Geist Regular' },
  { className: 'font-medium', label: 'Geist Medium' },
  { className: 'font-semibold', label: 'Geist Semibold' },
  { className: 'font-bold', label: 'Geist Bold' },
  { className: 'font-mono', label: 'Geist Mono' },
  { className: 'font-mono italic', label: 'Geist Mono Italic' },
] satisfies TypographyItem[]
