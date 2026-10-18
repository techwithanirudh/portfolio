import { tagline } from '@/constants/site'

// TODO(slopradar): duplication: the current role (intern at QuiverAI, quiver.ai) is hand-written here, in story.ts 'now' and in experiences.tsx, so a job change edits three files; interpolate it from the isCurrentEmployer entry in experiences (owner decision if the copy must change)
export const heroIntro = `${tagline} I design websites and write the code behind them. Right now that means AI products with Next.js, React and TypeScript, as a software engineering intern at [QuiverAI](https://quiver.ai).`

export const aboutIntro = [
  "I'm Anirudh, a full-stack developer who builds practical web apps. I started tinkering with Lego Mindstorms and kept building from there.",
  'My stack is Next.js, TypeScript, tRPC, Drizzle, and PostgreSQL. Python was part of my early experiments. I build products like [Depensa](/projects/depensa), [Coolify Tweaks](/projects/coolify_tweaks), and [Shadcn Portfolio](/projects/shadcn_portfolio).',
]
