import type {
  AttributionItem,
  TechnologyItem,
  TypographyItem,
} from '@/types/colophon'

export const technology = [
  {
    name: 'Next.js',
    description: 'App Router foundation with server components and streaming.',
    url: 'https://nextjs.org',
  },
  {
    name: 'TypeScript',
    description: 'Strict typing for safer, more readable UI code.',
    url: 'https://www.typescriptlang.org',
  },
  {
    name: 'Tailwind CSS',
    description: 'Utility-first styling with custom design tokens.',
    url: 'https://tailwindcss.com',
  },
  {
    name: 'Fumadocs',
    description: 'Typed MDX content with a docs-friendly layout engine.',
    url: 'https://fumadocs.dev',
  },
  {
    name: 'Radix UI + shadcn/ui',
    description: 'Accessible primitives and customized UI building blocks.',
    url: 'https://ui.shadcn.com',
  },
  {
    name: 'PostgreSQL',
    description: 'Reliable relational database for data persistence.',
    url: 'https://www.postgresql.org',
  },
  {
    name: 'Drizzle ORM',
    description: 'Type-safe queries and schema management.',
    url: 'https://orm.drizzle.team',
  },
  {
    name: 'Motion',
    description: 'Subtle reveals and transitions for a calmer rhythm.',
    url: 'https://motion.dev',
  },
  {
    name: 'Vercel',
    description: 'Edge-ready hosting and automatic previews.',
    url: 'https://vercel.com',
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
] satisfies AttributionItem[]

export const typography = [
  { label: 'Geist Regular', className: 'font-normal' },
  { label: 'Geist Medium', className: 'font-medium' },
  { label: 'Geist Semibold', className: 'font-semibold' },
  { label: 'Geist Bold', className: 'font-bold' },
  { label: 'Geist Mono', className: 'font-mono' },
  { label: 'Geist Mono Italic', className: 'font-mono italic' },
] satisfies TypographyItem[]
