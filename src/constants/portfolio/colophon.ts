export const colophonHero = {
  title: 'Colophon',
  description: 'The tools, technologies, and inspirations behind this website.',
} as const

export const colophonSections = {
  technology: {
    title: 'Technology',
  },
  attribution: {
    title: 'Attribution',
  },
  design: {
    title: 'Design Details',
  },
} satisfies Record<string, { title: string }>

export const colophonTechnology = [
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
    name: 'Fumadocs + MDX',
    description: 'Typed MDX content with a docs-friendly layout engine.',
    url: 'https://fumadocs.vercel.app',
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
] as const

export const colophonAttributions = [
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
] as const

export const colophonDesign = {
  intro: [
    'A calm, precise layout built around generous spacing, crisp rules, and soft depth.',
    'The UI relies on Geist Sans for headlines and body copy, with Geist Mono for code accents.',
    'Gradients and noise add glow without overwhelming the neutral foundation.',
  ],
  palette: [
    { label: 'Background', className: 'bg-background' },
    { label: 'Card', className: 'bg-card' },
    { label: 'Muted', className: 'bg-muted' },
    { label: 'Muted Foreground', className: 'bg-muted-foreground' },
    { label: 'Border', className: 'bg-border' },
    { label: 'Foreground', className: 'bg-foreground' },
    { label: 'Primary', className: 'bg-primary' },
    { label: 'Primary Soft', className: 'bg-primary/30' },
    { label: 'Accent', className: 'bg-accent' },
    { label: 'Accent Foreground', className: 'bg-accent-foreground' },
  ],
  typography: {
    heading: 'Geist Sans',
    mono: 'Geist Mono',
    bodySample: 'The quick brown fox jumps over the lazy dog.',
    inlineLink: 'Precise motion and spacing.',
  },
} as const
