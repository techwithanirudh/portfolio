/** Small colour helpers for the Properties panel's swatches and readouts. */

const toHex = (n: number) =>
  Math.round(Math.min(255, Math.max(0, n)))
    .toString(16)
    .padStart(2, '0')
    .toUpperCase()

const RGB = /rgba?\(([^)]+)\)/
const SEP = /[\s,/]+/

/** `rgb(26, 26, 26)` or `rgba(…)` → `#1A1A1A`, or null when transparent. */
export function cssToHex(value: string) {
  const match = value.match(RGB)
  if (!match) {
    return value.startsWith('#') ? value.toUpperCase() : null
  }
  const [r, g, b, a = '1'] = (match[1] ?? '').split(SEP).filter(Boolean)
  if (Number(a) === 0) {
    return null
  }
  return `#${toHex(Number(r))}${toHex(Number(g))}${toHex(Number(b))}`
}

function hslToHex(h: number, s: number, l: number) {
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    return 255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))
  }
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`
}

/**
 * A stable swatch for a stack tag, so "Next.js" is always the same colour.
 * Decorative: the colours carry no meaning beyond telling tags apart.
 */
export function tagSwatch(tag: string) {
  let hash = 0
  for (const char of tag) {
    hash = (hash * 31 + char.charCodeAt(0)) % 360
  }
  return hslToHex(hash, 0.62, 0.56)
}
