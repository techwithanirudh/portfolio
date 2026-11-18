const coverSwatches = [
  'violet',
  'lavender',
  'azure',
  'sky',
  'cyan',
  'blue',
] as const

export type CoverSwatch = (typeof coverSwatches)[number]

interface CoverBlob {
  cx: number
  cy: number
  rotate: number
  rx: number
  ry: number
  swatch: CoverSwatch
}

const MODULUS = 2_147_483_647
const WARMUP_DRAWS = 4

const hash = (value: string) => {
  let h = 7
  for (const char of value) {
    h = (h * 31 + (char.codePointAt(0) ?? 0)) % MODULUS
  }
  return h
}

const random = (seed: number) => {
  let state = (seed % (MODULUS - 1)) + 1
  const next = () => {
    state = (state * 16_807) % MODULUS
    return (state - 1) / (MODULUS - 1)
  }
  for (let i = 0; i < WARMUP_DRAWS; i++) {
    next()
  }
  return next
}

export const createCover = (
  slug: string
): { blobs: CoverBlob[]; seed: number } => {
  const seed = hash(slug)
  const next = random(seed)
  const swatches = coverSwatches
    .map((swatch) => ({ order: next(), swatch }))
    .toSorted((a, b) => a.order - b.order)
    .map(({ swatch }) => swatch)
  const count = next() > 0.4 ? 3 : 2
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
