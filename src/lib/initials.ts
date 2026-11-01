const whitespace = /\s+/

const graphemes = new Intl.Segmenter('en', { granularity: 'grapheme' })

const leadingGraphemes = (word: string, count: number) =>
  Array.from(graphemes.segment(word), ({ segment }) => segment)
    .slice(0, count)
    .join('')

// First and last word's first letter, or a single word's first two. Counts
// graphemes, so an emoji or flag stays whole. Null for a blank name
export const initials = (name?: string | null) => {
  const [first, ...rest] = name?.trim().split(whitespace).filter(Boolean) ?? []
  if (!first) {
    return null
  }
  const last = rest.at(-1)
  return (
    last
      ? leadingGraphemes(first, 1) + leadingGraphemes(last, 1)
      : leadingGraphemes(first, 2)
  ).toUpperCase()
}
