import type {
  AttributionItem,
  ColophonFact,
  ColorToken,
  DesignPrinciple,
  FontSpecimen,
  TechnologyGroup,
  TypographyItem,
} from '@/types/colophon'

export const facts = [
  { label: 'Framework', value: 'Next.js 16' },
  { label: 'Styling', value: 'Tailwind v4' },
  { label: 'Typeface', value: 'Geist' },
  { label: 'Hosting', value: 'Vercel' },
] satisfies ColophonFact[]

export const technologyGroups = [
  {
    items: [
      {
        description: 'App Router, server components and streaming.',
        name: 'Next.js',
        url: 'https://nextjs.org',
      },
      {
        description:
          'Strict mode everywhere, so the compiler catches my typos.',
        name: 'TypeScript',
        url: 'https://www.typescriptlang.org',
      },
    ],
    label: 'Framework',
  },
  {
    items: [
      {
        description:
          'v4 with CSS-first tokens for the rules, hatches and palette.',
        name: 'Tailwind CSS',
        url: 'https://tailwindcss.com',
      },
      {
        description: 'Unstyled, accessible primitives under the shadcn/ui kit.',
        name: 'Base UI',
        url: 'https://base-ui.com',
      },
      {
        description: 'Components I own and squared off to fit the grid.',
        name: 'shadcn/ui',
        url: 'https://ui.shadcn.com',
      },
      {
        description: 'Small reveals and hover bits, nothing too loud.',
        name: 'Motion',
        url: 'https://motion.dev',
      },
      {
        description: 'Powers the testimonials carousel on the home page.',
        name: 'Embla Carousel',
        url: 'https://www.embla-carousel.com',
      },
    ],
    label: 'Interface',
  },
  {
    items: [
      {
        description:
          'Typed MDX for the blog and work pages, on the Base UI flavor.',
        name: 'Fumadocs',
        url: 'https://fumadocs.dev',
      },
      {
        description: 'Syntax highlighting for every code block.',
        name: 'Shiki',
        url: 'https://shiki.style',
      },
    ],
    label: 'Content',
  },
  {
    items: [
      {
        description: 'Holds the guestbook, comments and accounts.',
        name: 'PostgreSQL',
        url: 'https://www.postgresql.org',
      },
      {
        description: 'Type-safe queries and migrations.',
        name: 'Drizzle ORM',
        url: 'https://orm.drizzle.team',
      },
      {
        description: 'GitHub and Google sign in for the guestbook.',
        name: 'Better Auth',
        url: 'https://www.better-auth.com',
      },
      {
        description: 'Sends the contact form straight to my inbox.',
        name: 'Resend',
        url: 'https://resend.com',
      },
    ],
    label: 'Data',
  },
  {
    items: [
      {
        description: 'Streams the chat and runs its tools.',
        name: 'AI SDK',
        url: 'https://ai-sdk.dev',
      },
      {
        description: 'The chat UI blocks, restyled to match the site.',
        name: 'AI Elements',
        url: 'https://ai-sdk.dev/elements',
      },
      {
        description: 'My Shih Tzu mascot. Ask him anything about me.',
        name: 'Simba',
      },
    ],
    label: 'AI',
  },
  {
    items: [
      {
        description: 'Runtime, package manager and script runner.',
        name: 'Bun',
        url: 'https://bun.sh',
      },
      {
        description: 'Biome with the Ultracite preset for lint and format.',
        name: 'Ultracite',
        url: 'https://www.ultracite.ai',
      },
      {
        description: 'Hosting, previews and blob storage.',
        name: 'Vercel',
        url: 'https://vercel.com',
      },
    ],
    label: 'Tooling',
  },
] satisfies TechnologyGroup[]

export const technology = technologyGroups.flatMap((group) => group.items)

export const fonts = [
  {
    className: 'font-sans',
    name: 'Geist Sans',
    role: 'Body',
    url: 'https://vercel.com/font',
  },
  {
    className: 'font-mono',
    name: 'Geist Mono',
    role: 'Headings',
    url: 'https://vercel.com/font',
  },
] satisfies FontSpecimen[]

export const typography = [
  { className: 'font-normal', label: 'Regular', weight: 400 },
  { className: 'font-medium', label: 'Medium', weight: 500 },
  { className: 'font-semibold', label: 'Semibold', weight: 600 },
  { className: 'font-bold', label: 'Bold', weight: 700 },
] satisfies TypographyItem[]

export const principles = [
  {
    description: 'No radius anywhere, from buttons to dialogs.',
    title: 'Square corners',
  },
  {
    description:
      'Every panel shares the same rails, and rules run edge to edge.',
    title: 'Ruled grid',
  },
  {
    description: 'Gaps and empty cells get a diagonal hatch instead of air.',
    title: 'Hatched fill',
  },
  {
    description: 'Geist Mono for headings and labels, Geist Sans for reading.',
    title: 'Mono headings',
  },
  {
    description:
      'Hovers only rotate or scale. Nothing slides under your cursor.',
    title: 'Quiet motion',
  },
  {
    description: 'Links click softly on hover. Turn it off in the footer.',
    title: 'Little sounds',
  },
] satisfies DesignPrinciple[]

export const palette = [
  { className: 'bg-background', label: 'Background', token: '--background' },
  { className: 'bg-card', label: 'Card', token: '--card' },
  { className: 'bg-muted', label: 'Muted', token: '--muted' },
  { className: 'bg-border', label: 'Border', token: '--border' },
  {
    className: 'bg-muted-foreground',
    label: 'Muted text',
    token: '--muted-foreground',
  },
  { className: 'bg-foreground', label: 'Foreground', token: '--foreground' },
  { className: 'bg-primary', label: 'Primary', token: '--primary' },
  { className: 'bg-primary/30', label: 'Primary soft', token: '--primary/30' },
  { className: 'bg-accent', label: 'Accent', token: '--accent' },
  {
    className: 'bg-accent-foreground',
    label: 'Accent text',
    token: '--accent-foreground',
  },
] satisfies ColorToken[]

export const attributions = [
  { name: 'Chanh Dai', url: 'https://chanhdai.com' },
  { name: 'Nelson Lai', url: 'https://nelsonlai.dev' },
  { name: 'Braydon Coyer', url: 'https://www.braydoncoyer.dev' },
  { name: 'Emil Kowalski', url: 'https://emilkowal.ski' },
  { name: 'Shu Ding', url: 'https://shud.in' },
  { name: 'Josh W. Comeau', url: 'https://www.joshwcomeau.com' },
  { name: 'shadcn/ui', url: 'https://ui.shadcn.com' },
  { name: 'Tailwind CSS', url: 'https://tailwindcss.com' },
  { name: 'Tiptap', url: 'https://tiptap.dev' },
  { name: 'Hexaa', url: 'https://hexaa.sh' },
  { name: 'Ingo', url: 'https://ingo.au' },
  { name: 'Eververse', url: 'https://www.eververse.ai' },
  { name: 'Steve', url: 'https://iamsteve.me' },
  { name: 'Visitors', url: 'https://visitors.now' },
  { name: 'Ephraim Duncan', url: 'https://ephraimduncan.com' },
  { name: 'Suraj Gaud', url: 'https://www.surajgaud.com' },
  { name: 'Kinfish', url: 'https://kinfish.farmui.com' },
  { name: 'Enscribe', url: 'https://enscribe.dev' },
  { name: 'Lean Rada', url: 'https://leanrada.com' },
  { name: 'Victor Eke', url: 'https://victoreke.com' },
  { name: 'Noah Dunnagan', url: 'https://noahdunnagan.com' },
] satisfies AttributionItem[]
