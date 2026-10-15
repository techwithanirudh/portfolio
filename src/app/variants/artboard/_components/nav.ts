/** Variant routes. Client-safe: no content imports. */
export const BASE = '/variants/artboard'

export const pages = [
  { href: BASE, id: 'home', label: 'Home' },
  { href: `${BASE}/about`, id: 'about', label: 'About' },
  { href: `${BASE}/work`, id: 'work', label: 'Work' },
] as const
