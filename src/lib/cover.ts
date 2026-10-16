// The generated post covers: a few soft blobs per post, laid out from a seed
// so a slug always lands on the same art. The blog cards draw them as SVG in
// the page and the OG images draw the same layout server side.

/** Purple/azure swatches, named so each renderer picks its own tones. */
export const coverSwatches = [
  'violet',
  'lavender',
  'azure',
  'sky',
  'cyan',
  'blue',
] as const

export type CoverSwatch = (typeof coverSwatches)[number]

export interface CoverBlob {
  cx: number
  cy: number
  rotate: number
  rx: number
  ry: number
  swatch: CoverSwatch
}

const MODULUS = 2_147_483_647

// A plain polynomial hash, so a slug always lands on the same cover
const hash = (value: string) => {
  let h = 7
  for (const char of value) {
    h = (h * 31 + (char.codePointAt(0) ?? 0)) % MODULUS
  }
  return h
}

// Park-Miller, a tiny seeded PRNG for the blob layout. The first few draws
// track the seed too closely, so they get thrown away.
const random = (seed: number) => {
  let state = (seed % (MODULUS - 1)) + 1
  const next = () => {
    state = (state * 16_807) % MODULUS
    return (state - 1) / (MODULUS - 1)
  }
  for (let i = 0; i < 4; i++) {
    next()
  }
  return next
}

/**
 * The cover for a slug: its seed and two or three blobs, in a 100 by 100
 * box that the renderer stretches over the frame.
 */
export const createCover = (
  slug: string
): { blobs: CoverBlob[]; seed: number } => {
  const seed = hash(slug)
  const next = random(seed)
  // Shuffle the swatches so every blob gets its own color
  const swatches = coverSwatches
    .map((swatch) => ({ order: next(), swatch }))
    .toSorted((a, b) => a.order - b.order)
    .map(({ swatch }) => swatch)
  const count = next() > 0.4 ? 3 : 2
  // Blobs hug the edges, spread around the frame, so the middle stays airy
  const start = next() * Math.PI * 2
  const blobs = Array.from({ length: count }, (_, i) => {
    const angle = start + (i * Math.PI * 2) / count + (next() - 0.5) * 0.9
    return {
      cx: 50 + Math.cos(angle) * (50 + next() * 20),
      cy: 50 + Math.sin(angle) * (50 + next() * 20),
      rotate: (next() - 0.5) * 90,
      rx: 32 + next() * 24,
      ry: 50 + next() * 30,
      swatch: swatches[i] ?? 'blue',
    }
  })

  return { blobs, seed }
}
