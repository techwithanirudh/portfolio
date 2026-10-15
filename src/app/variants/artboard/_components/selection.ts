/**
 * What the Properties panel knows about a selected layer. Built on the
 * server from the same data the canvas renders, so the panel never retypes a
 * fact; geometry (X, Y, W, H) and typography are read live from the DOM.
 */

export type LayerType =
  | 'component'
  | 'frame'
  | 'group'
  | 'image'
  | 'text'
  | 'vector'

export interface SelectionField {
  href?: string
  label: string
  mono?: boolean
  value: string
}

export interface SelectionExport {
  hint: string
  href: string
  label: string
}

export type CodeValue = boolean | number | string | readonly string[]

export interface SelectionInfo {
  /** JSX the Code tab prints for this layer. */
  code?: { component: string; props: [string, CodeValue][] }
  exports?: SelectionExport[]
  fields: SelectionField[]
  /** Stack, skills or tags, listed as Figma-style fills. */
  fills?: { label: string; items: readonly string[] }
  id: string
  /** Kind shown next to the type, e.g. "Project". */
  kind: string
  name: string
  /** Primary link, opened on double-click. */
  open?: string
  type: LayerType
}

const monthYear = new Intl.DateTimeFormat('en', {
  month: 'short',
  timeZone: 'UTC',
  year: 'numeric',
})

export const formatMonthYear = (date: Date) => monthYear.format(date)

const fullDate = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
  year: 'numeric',
})

export const formatDate = (date: Date) => fullDate.format(date)

export const isoDate = (date: Date) => date.toISOString().slice(0, 10)

/** `08.2026` → `Aug 2026`, `2021` → `2021`. */
export function formatPeriodPart(part?: string) {
  if (!part) {
    return 'Now'
  }
  const [month, year] = part.split('.')
  if (!year) {
    return month
  }
  return monthYear.format(new Date(Date.UTC(Number(year), Number(month) - 1)))
}

export const formatPeriod = (period: { end?: string; start: string }) =>
  `${formatPeriodPart(period.start)} – ${formatPeriodPart(period.end)}`

const PROTOCOL = /^https?:\/\//
const WWW = /^www\./
const TRAILING_SLASH = /\/$/

export const hostOf = (url: string) =>
  url.replace(PROTOCOL, '').replace(WWW, '').replace(TRAILING_SLASH, '')
