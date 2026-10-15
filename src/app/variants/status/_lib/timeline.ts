/**
 * Everything the Status variant derives from the real data: career months
 * coloured by kind, project status and month segments, incident history.
 * Nothing here is typed in by hand; each rule is written next to the code so
 * the page can say "derived" and mean it.
 */
import { format } from 'date-fns'
import { parsePeriodDate } from '@/lib/employment-period'
import type { ExperienceItemType } from '@/types/experience'
import {
  chapters,
  experiences,
  getWork,
  plain,
  profile,
} from '../../_shared/profile'

export const START_YEAR = 2018

/** One bar in an uptime row. `tone` is a CSS colour (a variant token). */
export interface Segment {
  detail?: string
  key: string
  label: string
  /** `future` renders as an outline, `empty` as nothing, the rest filled. */
  state: 'active' | 'idle' | 'empty' | 'future'
  tone?: string
}

export type CareerKind = 'robotics' | 'ai' | 'web' | 'fullstack' | 'teams'

export const careerKinds: {
  chapter: (typeof chapters)[number]['id']
  kind: CareerKind
  label: string
  tone: string
}[] = [
  {
    chapter: 'lego',
    kind: 'robotics',
    label: 'Robotics',
    tone: 'var(--kind-1)',
  },
  { chapter: 'python', kind: 'ai', label: 'AI', tone: 'var(--kind-2)' },
  { chapter: 'web', kind: 'web', label: 'Web', tone: 'var(--kind-3)' },
  {
    chapter: 'fullstack',
    kind: 'fullstack',
    label: 'Full stack',
    tone: 'var(--kind-4)',
  },
  { chapter: 'teams', kind: 'teams', label: 'Teams', tone: 'var(--kind-5)' },
]

const FALLBACK_KIND = {
  chapter: 'fullstack',
  kind: 'fullstack',
  label: 'Full stack',
  tone: 'var(--kind-4)',
} as const

const kindMeta = (kind: CareerKind) =>
  careerKinds.find((k) => k.kind === kind) ?? FALLBACK_KIND

/** The personal positions are the solo eras, keyed by their id in the data. */
const personalKindById: Record<string, CareerKind> = {
  '1': 'robotics',
  '2': 'ai',
  '3': 'web',
  '4': 'fullstack',
}

const monthIndex = (d: Date) => d.getFullYear() * 12 + d.getMonth()
const fromIndex = (i: number) => new Date(Math.floor(i / 12), i % 12, 1)
const monthLabel = (d: Date) => format(d, 'MMM yyyy')

const personal = experiences.find((e) => e.id === 'personal')
const employers = experiences.filter((e) => e.id !== 'personal')

interface Span {
  company?: ExperienceItemType
  end: number
  kind: CareerKind
  start: number
  title: string
}

const spans = (now: Date): Span[] => {
  const nowIdx = monthIndex(now)
  const solo: Span[] = (personal?.positions ?? []).map((p) => ({
    end: p.employmentPeriod.end
      ? monthIndex(parsePeriodDate(p.employmentPeriod.end, 'last'))
      : nowIdx,
    kind: personalKindById[p.id] ?? 'fullstack',
    start: monthIndex(parsePeriodDate(p.employmentPeriod.start, 'first')),
    title: p.title,
  }))
  const team: Span[] = employers.flatMap((company) =>
    company.positions.map((p) => ({
      company,
      end: p.employmentPeriod.end
        ? monthIndex(parsePeriodDate(p.employmentPeriod.end, 'last'))
        : nowIdx,
      kind: 'teams' as const,
      start: monthIndex(parsePeriodDate(p.employmentPeriod.start, 'first')),
      title: p.title,
    }))
  )
  return [...team, ...solo.sort((a, b) => a.start - b.start)]
}

/**
 * Which kind of work filled a month. Team roles have month precision and win.
 * Solo eras only have years, so where two of them share a year the earlier
 * one takes January to June and the later one July to December.
 */
const spanForMonth = (all: Span[], idx: number): Span | undefined => {
  const team = all.find(
    (s) => s.kind === 'teams' && s.start <= idx && idx <= s.end
  )
  if (team) {
    return team
  }
  const solo = all.filter(
    (s) => s.kind !== 'teams' && s.start <= idx && idx <= s.end
  )
  if (solo.length > 1) {
    return idx % 12 < 6 ? solo[0] : solo.at(-1)
  }
  return solo[0]
}

const careerSegment = (all: Span[], idx: number, nowIdx: number): Segment => {
  const date = fromIndex(idx)
  const key = format(date, 'yyyy-MM')
  if (idx > nowIdx) {
    return { key, label: monthLabel(date), state: 'future' }
  }
  const span = spanForMonth(all, idx)
  if (!span) {
    return { key, label: monthLabel(date), state: 'empty' }
  }
  const meta = kindMeta(span.kind)
  return {
    detail: span.company
      ? `${span.company.companyName} · ${span.title}`
      : span.title,
    key,
    label: `${monthLabel(date)} · ${meta.label}`,
    state: 'active',
    tone: meta.tone,
  }
}

/** Every month from January 2018 to now, one segment each. */
export const getCareerMonths = (now = new Date()): Segment[] => {
  const all = spans(now)
  const nowIdx = monthIndex(now)
  const first = START_YEAR * 12
  return Array.from({ length: nowIdx - first + 1 }, (_, i) =>
    careerSegment(all, first + i, nowIdx)
  )
}

/** One row per year, twelve months each; months after now are outlines. */
export const getCareerYears = (now = new Date()) => {
  const all = spans(now)
  const nowIdx = monthIndex(now)
  return Array.from({ length: now.getFullYear() - START_YEAR + 1 }, (_, y) => {
    const year = START_YEAR + y
    const months = Array.from({ length: 12 }, (__, m) =>
      careerSegment(all, year * 12 + m, nowIdx)
    )
    const counts = new Map<string, number>()
    for (const s of months) {
      if (s.tone) {
        const label = s.label.split(' · ')[1] ?? ''
        counts.set(label, (counts.get(label) ?? 0) + 1)
      }
    }
    const main = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
    return { main, months, year }
  })
}

export const yearsBuilding = (now = new Date()) =>
  now.getFullYear() - START_YEAR

// --- Projects ---------------------------------------------------------------

export type ProjectStatus = 'operational' | 'maintained' | 'archived'

export const projectStatuses: {
  rule: string
  status: ProjectStatus
  label: string
  tone: string
}[] = [
  {
    label: 'Operational',
    rule: 'has a live website',
    status: 'operational',
    tone: 'var(--ok)',
  },
  {
    label: 'Maintained',
    rule: 'has a repo and is from 2025 or later',
    status: 'maintained',
    tone: 'var(--maint)',
  },
  {
    label: 'Archived',
    rule: 'launched before 2024',
    status: 'archived',
    tone: 'var(--archived)',
  },
]

const FALLBACK_STATUS = {
  label: 'Archived',
  rule: 'launched before 2024',
  status: 'archived',
  tone: 'var(--archived)',
} as const

export const statusMeta = (status: ProjectStatus) =>
  projectStatuses.find((s) => s.status === status) ?? FALLBACK_STATUS

type WorkItem = ReturnType<typeof getWork>[number]

/**
 * Archived first (age beats everything), then Operational for a website,
 * then Maintained for a recent repo.
 */
export const deriveStatus = (w: WorkItem): ProjectStatus => {
  if (w.date < new Date(2024, 0, 1)) {
    return 'archived'
  }
  if (w.website) {
    return 'operational'
  }
  if (w.github && w.date >= new Date(2025, 0, 1)) {
    return 'maintained'
  }
  return 'archived'
}

/** Months a project counts as active after launch, unless it is maintained. */
export const ACTIVE_WINDOW = 6

export const getComponents = (now = new Date()) => {
  const work = getWork()
  const nowIdx = monthIndex(now)
  const firstIdx = Math.min(...work.map((w) => monthIndex(w.date)))

  const items = work.map((w) => {
    const status = deriveStatus(w)
    const meta = statusMeta(status)
    const launch = monthIndex(w.date)
    const activeUntil =
      status === 'maintained' ? nowIdx : launch + ACTIVE_WINDOW - 1
    const segments: Segment[] = Array.from(
      { length: nowIdx - firstIdx + 1 },
      (_, i) => {
        const idx = firstIdx + i
        const date = fromIndex(idx)
        const key = format(date, 'yyyy-MM')
        if (idx < launch) {
          return { key, label: monthLabel(date), state: 'empty' }
        }
        const active = idx <= activeUntil
        return {
          detail: idx === launch ? 'Launched' : undefined,
          key,
          label: `${monthLabel(date)} · ${active ? 'active' : 'quiet'}`,
          state: active ? 'active' : 'idle',
          tone: active ? meta.tone : undefined,
        }
      }
    )
    return {
      description: w.description,
      github: w.github,
      image: w.image,
      launched: format(w.date, 'MMM yyyy'),
      pinned: w.pinned,
      segments,
      slug: w.slug,
      status,
      tags: w.tags,
      title: w.title,
      url: w.url,
      website: w.website,
      year: w.year,
    }
  })

  const axis = Array.from(
    { length: now.getFullYear() - fromIndex(firstIdx).getFullYear() + 1 },
    (_, i) => {
      const year = fromIndex(firstIdx).getFullYear() + i
      const startIdx = Math.max(year * 12, firstIdx)
      return {
        offset: (startIdx - firstIdx) / (nowIdx - firstIdx + 1),
        year,
      }
    }
  )

  return { axis, items }
}

export type ComponentItem = ReturnType<typeof getComponents>['items'][number]

// --- Incidents --------------------------------------------------------------

export type IncidentStage =
  | 'Investigating'
  | 'Identified'
  | 'Update'
  | 'Monitoring'
  | 'Resolved'

export interface Incident {
  duration: string
  id: string
  ongoing: boolean
  title: string
  tone: string
  updates: { stage: IncidentStage; text: string; when: string }[]
  years: string
}

const parseYears = (years: string) => {
  const [start, end] = years.split('–').map((s) => s.trim())
  return { end: end === 'now' ? undefined : end, start: start ?? '' }
}

/** The journey as incident history, newest first, each with its updates. */
export const getIncidents = (now = new Date()): Incident[] => {
  const list = chapters.map((chapter, i) => {
    const meta =
      careerKinds.find((k) => k.chapter === chapter.id) ?? FALLBACK_KIND
    const { start, end } = parseYears(chapter.years)
    const next = chapters[i + 1]
    const nextId = next ? `INC-${parseYears(next.years).start}` : undefined
    const updates: Incident['updates'] = [
      { stage: 'Investigating', text: chapter.body, when: start },
    ]

    if (meta.kind === 'teams') {
      const roles = employers
        .flatMap((company) =>
          company.positions.map((p) => ({
            company,
            date: parsePeriodDate(p.employmentPeriod.start, 'first'),
            p,
          }))
        )
        .sort((a, b) => a.date.getTime() - b.date.getTime())
      for (const { company, date, p } of roles) {
        updates.push({
          stage: 'Update',
          text: `${company.companyName}, ${p.title}. ${plain(p.description)}`,
          when: format(date, 'MMM yyyy'),
        })
      }
    } else {
      const position = personal?.positions.find(
        (p) => personalKindById[p.id] === meta.kind
      )
      if (position?.skills?.length) {
        updates.push({
          stage: 'Identified',
          text: `Stack: ${position.skills.join(', ')}.`,
          when: start,
        })
      }
    }

    if (end) {
      updates.push({
        stage: 'Resolved',
        text: next ? `Superseded by ${nextId}, “${next.title}”.` : 'Resolved.',
        when: end,
      })
    } else {
      updates.push({
        stage: 'Monitoring',
        text:
          meta.kind === 'teams'
            ? `Ongoing: ${profile.current.title} at ${profile.current.company}.`
            : 'Ongoing. New releases land on the Work page.',
        when: 'Now',
      })
    }

    const endYear = end ? Number(end) : now.getFullYear()
    const span = Math.max(endYear - Number(start), 1)

    return {
      duration: `${span} ${span === 1 ? 'year' : 'years'}${end ? '' : ' so far'}`,
      id: `INC-${start}`,
      ongoing: !end,
      title: chapter.title,
      tone: meta.tone,
      updates: updates.reverse(),
      years: chapter.years,
    }
  })
  return list.reverse()
}
