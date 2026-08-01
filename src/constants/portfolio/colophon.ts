import type {
  AttributionItem,
  TechnologyItem,
  TypographyItem,
} from '@/types/colophon'

export const technology = [
  {
    description: 'App Router foundation with server components and streaming.',
    name: 'Next.js',
    url: 'https://nextjs.org',
  },
  {
    description: 'Strict typing for safer, more readable UI code.',
    name: 'TypeScript',
    url: 'https://www.typescriptlang.org',
  },
  {
    description: 'Utility-first styling with custom design tokens.',
    name: 'Tailwind CSS',
    url: 'https://tailwindcss.com',
  },
  {
    description: 'Typed MDX content with a docs-friendly layout engine.',
    name: 'Fumadocs',
    url: 'https://fumadocs.dev',
  },
  {
    description: 'Accessible primitives and customized UI building blocks.',
    name: 'Radix UI + shadcn/ui',
    url: 'https://ui.shadcn.com',
  },
  {
    description: 'Reliable relational database for data persistence.',
    name: 'PostgreSQL',
    url: 'https://www.postgresql.org',
  },
  {
    description: 'Type-safe queries and schema management.',
    name: 'Drizzle ORM',
    url: 'https://orm.drizzle.team',
  },
  {
    description: 'Subtle reveals and transitions for a calmer rhythm.',
    name: 'Motion',
    url: 'https://motion.dev',
  },
  {
    description: 'Fast all-in-one runtime, bundler, and package manager.',
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
  { name: 'Eververse', url: 'https://www.eververse.ai' },
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

export const typography = [
  { className: 'font-normal', label: 'Geist Regular' },
  { className: 'font-medium', label: 'Geist Medium' },
  { className: 'font-semibold', label: 'Geist Semibold' },
  { className: 'font-bold', label: 'Geist Bold' },
  { className: 'font-mono', label: 'Geist Mono' },
  { className: 'font-mono italic', label: 'Geist Mono Italic' },
] satisfies TypographyItem[]
