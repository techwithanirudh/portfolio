/**
 * The few things this variant needs that are not in the shared profile:
 * routes, deterministic tilts, photo slots and the placeholders Anirudh
 * would fill in. Anything in square brackets is a placeholder, on purpose.
 */

export const base = '/variants/field-notes'

export const nav = [
  { href: base, label: 'Home' },
  { href: `${base}/about`, label: 'About' },
  { href: `${base}/work`, label: 'Work' },
] as const

const tilts = [-2.6, 1.8, -4.2, 3.1, -1.4, 4.6, -3.4, 2.2] as const

/** A small, repeatable tilt in degrees for the nth paper object. */
export const tilt = (index: number, scale = 1) =>
  (tilts[index % tilts.length] ?? 0) * scale

export type PhotoSlot =
  | { kind: 'image'; src: string; alt: string; caption: string }
  | { kind: 'placeholder'; label: string; caption: string }

/** The strip of photos under the letter on Home. */
export const homePhotos: PhotoSlot[] = [
  {
    caption: 'me, these days',
    kind: 'placeholder',
    label: '[photo: you, recent]',
  },
  {
    alt: 'Simba the Shih Tzu in a Santa hat, the site avatar',
    caption: 'Simba, the avatar',
    kind: 'image',
    src: '/images/profile.png',
  },
  {
    caption: 'where it started',
    kind: 'placeholder',
    label: '[photo: Lego Mindstorms build, 2018]',
  },
]

/** One photo per journey chapter, keyed by chapter id. */
export const chapterPhotos: Record<string, PhotoSlot> = {
  fullstack: {
    alt: 'Cover of the Shadcn Portfolio template',
    caption: 'Shadcn Portfolio, a template',
    kind: 'image',
    src: '/images/projects/shadcn_portfolio/cover.png',
  },
  lego: {
    caption: 'robots first',
    kind: 'placeholder',
    label: '[photo: robotics, 2018]',
  },
  python: {
    caption: 'early experiments',
    kind: 'placeholder',
    label: '[photo: an OpenCV experiment, 2019]',
  },
  teams: {
    alt: 'Cover of the autonomous driving privacy research project',
    caption: 'the Bosch paper, 2022',
    kind: 'image',
    src: '/images/projects/autonomous_driving/cover.png',
  },
  web: {
    alt: 'Maskio, a pixel-art platformer',
    caption: 'Maskio, GitHub Game Jam',
    kind: 'image',
    src: '/images/projects/maskio/cover.jpg',
  },
}

/** When the Now card was last edited. Bump it with the card. */
export const nowUpdated = new Date('2026-10-15T12:00:00+05:30')

export const nowPlaceholders = {
  learning: '[learning: what you are picking up right now]',
  reading: '[reading: book title, author]',
}

/**
 * Victor Eke's "Heroes" list, reframed. Every entry is a placeholder for
 * Anirudh to replace with real names and links; `met` ticks the box.
 */
export const people: { name: string; met: boolean }[] = [
  { met: true, name: '[name: a designer you learn from]' },
  { met: false, name: '[name: an engineer you admire]' },
  { met: false, name: '[name: an open-source maintainer]' },
  { met: true, name: '[name: a founder you have worked with]' },
  { met: false, name: '[name: a YouTuber who taught you]' },
  { met: false, name: '[name: a writer you reread]' },
  { met: false, name: '[name: a researcher]' },
  { met: false, name: '[name: someone from a game jam]' },
]
