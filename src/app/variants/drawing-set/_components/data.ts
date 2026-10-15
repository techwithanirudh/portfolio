/**
 * Everything the drawing set derives from the shared profile data: the sheet
 * index, the revision table (the career, oldest first) and the BOM finish of
 * each project. Nothing here is typed in by hand; it is all computed from
 * `../../_shared/profile` so the sheets cannot drift from the real site.
 */
import {
  chapters,
  experiences,
  type getWork,
  plain,
} from '../../_shared/profile'

export const BASE = '/variants/drawing-set'

export type SheetCode = 'A-01' | 'A-02' | 'A-03' | 'A-04' | 'A-05'

export interface Sheet {
  code: SheetCode
  /** True when the sheet lives on the real site rather than in this variant. */
  external?: boolean
  href: string
  name: string
  /** What the title block prints in its TITLE cell. */
  title: string
}

export const sheets: Sheet[] = [
  { code: 'A-01', href: BASE, name: 'Home', title: 'Home' },
  {
    code: 'A-02',
    href: `${BASE}/about`,
    name: 'About',
    title: 'About, revision history',
  },
  {
    code: 'A-03',
    href: `${BASE}/work`,
    name: 'Work',
    title: 'Work, bill of materials',
  },
  {
    code: 'A-04',
    external: true,
    href: '/blog',
    name: 'Writing',
    title: 'Writing',
  },
  {
    code: 'A-05',
    external: true,
    href: '/contact',
    name: 'Contact',
    title: 'Contact',
  },
]

export const getSheet = (code: SheetCode): Sheet =>
  sheets.find((sheet) => sheet.code === code) ?? (sheets[0] as Sheet)

/* --------------------------------------------------------------- revisions */

type Chapter = (typeof chapters)[number]

export interface Revision {
  /** Present on the first revision of each chapter, so its prose shows once. */
  chapter: Chapter
  chapterStart: boolean
  company?: { logo?: string; name: string; url?: string }
  /** `2018` or `2022-04`, as precise as the source data. */
  date: string
  description?: string
  id: string
  isCurrent: boolean
  letter: string
  skills: string[]
  title: string
  type?: string
  year: number
}

/** `MM.YYYY` or `YYYY` (the experience data's format) to a sortable key. */
const periodKey = (period: string) => {
  const [a, b] = period.split('.')
  return b ? Number(b) * 100 + Number(a) : Number(a) * 100
}

const periodLabel = (period: string) => {
  const [a, b] = period.split('.')
  return b ? `${b}-${a}` : (a ?? period)
}

const chapterStartYear = (chapter: Chapter) =>
  Number.parseInt(chapter.years.slice(0, 4), 10)

const chapterFor = (year: number): Chapter =>
  [...chapters].reverse().find((c) => chapterStartYear(c) <= year) ??
  (chapters[0] as Chapter)

const buildRevisions = (): Revision[] => {
  const rows = experiences
    .flatMap((experience) =>
      experience.positions.map((position) => ({ experience, position }))
    )
    .sort(
      (a, b) =>
        periodKey(a.position.employmentPeriod.start) -
        periodKey(b.position.employmentPeriod.start)
    )

  const seen = new Set<string>()
  const latest = rows.length - 1

  return rows.map(({ experience, position }, index) => {
    const start = position.employmentPeriod.start
    const year = Math.floor(periodKey(start) / 100)
    const chapter = chapterFor(year)
    const chapterStart = !seen.has(chapter.id)
    seen.add(chapter.id)
    const isPersonal = experience.id === 'personal'

    return {
      chapter,
      chapterStart,
      company: isPersonal
        ? undefined
        : {
            logo: experience.companyLogo,
            name: experience.companyName,
            url: experience.companyWebsite,
          },
      date: periodLabel(start),
      description: position.description
        ? plain(position.description)
        : undefined,
      id: `${experience.id}-${position.id}`,
      isCurrent: index === latest,
      letter: String.fromCharCode(65 + index),
      skills: position.skills ?? [],
      title: position.title,
      type: position.employmentType,
      year,
    }
  })
}

export const revisions = buildRevisions()

export const currentRevision = revisions.at(-1) as Revision
export const firstRevision = revisions[0] as Revision
export const revisionSpan = currentRevision.year - firstRevision.year

/* --------------------------------------------------------------------- BOM */

export type WorkItem = ReturnType<typeof getWork>[number]

export type Finish = 'Research' | 'Template' | 'Archived' | 'Shipped' | 'Source'

const TEMPLATE = /template/i

/**
 * Derived, most specific first. The brief listed website before the others,
 * but in that order every pre-2023 project has a website and nothing would
 * ever read Research or Archived, so the specific finishes win here.
 */
export const finishOf = (item: WorkItem): Finish => {
  if (item.tags.includes('Research')) {
    return 'Research'
  }
  if (TEMPLATE.test(item.title)) {
    return 'Template'
  }
  if (item.year < 2023) {
    return 'Archived'
  }
  if (item.website) {
    return 'Shipped'
  }
  return 'Source'
}

export const finishes: { finish: Finish; rule: string }[] = [
  { finish: 'Shipped', rule: 'has a live website' },
  { finish: 'Source', rule: 'source only, no live site' },
  { finish: 'Template', rule: 'title names a template' },
  { finish: 'Research', rule: 'tagged Research' },
  { finish: 'Archived', rule: 'dated before 2023' },
]

/** `A`, `B` … `Z`, `AA` for the DETAIL callout on each BOM row. */
export const detailLetter = (index: number): string => {
  const letter = String.fromCharCode(65 + (index % 26))
  return index >= 26
    ? `${detailLetter(Math.floor(index / 26) - 1)}${letter}`
    : letter
}

export const pad = (n: number, size = 2) => String(n).padStart(size, '0')

const isoDay = new Intl.DateTimeFormat('en-CA', {
  day: '2-digit',
  month: '2-digit',
  timeZone: 'UTC',
  year: 'numeric',
})

export const formatDay = (date: Date) => isoDay.format(date)
