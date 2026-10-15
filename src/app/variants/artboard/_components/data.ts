import type { Testimonial } from '@/types'
import type { ExperienceItemType } from '@/types/experience'
import {
  type ExperienceKind,
  type getWork,
  type getWriting,
  groupedExperience,
  plain,
  profile,
} from '../../_shared/profile'
import {
  formatDate,
  formatPeriod,
  hostOf,
  isoDate,
  type SelectionInfo,
} from './selection'

export type WorkItem = ReturnType<typeof getWork>[number]
export type PostItem = ReturnType<typeof getWriting>[number]
export type Experience = ExperienceItemType
export type Position = ExperienceItemType['positions'][number]

/** Shipped, Template, Research or Archived, derived from the data. */
export function projectStatus(item: WorkItem) {
  if (item.tags.includes('Research')) {
    return 'Research'
  }
  if (item.title.includes('Template')) {
    return 'Template'
  }
  if (item.year < 2023) {
    return 'Archived'
  }
  return item.website ? 'Shipped' : 'Source'
}

export function projectInfo(item: WorkItem): SelectionInfo {
  const exports = [
    { hint: 'Case study', href: item.url, label: item.url },
    ...(item.website
      ? [{ hint: 'Website', href: item.website, label: hostOf(item.website) }]
      : []),
    ...(item.github
      ? [{ hint: 'Source', href: item.github, label: hostOf(item.github) }]
      : []),
  ]
  return {
    code: {
      component: 'Project',
      props: [
        ['name', item.title],
        ['year', item.year],
        ['status', projectStatus(item)],
        ['stack', item.tags],
        ['href', item.url],
      ],
    },
    exports,
    fields: [
      { label: 'Name', value: item.title },
      { label: 'Year', mono: true, value: String(item.year) },
      { label: 'Date', mono: true, value: isoDate(item.date) },
      { label: 'Status', value: `${projectStatus(item)} (derived)` },
      { label: 'About', value: item.description },
    ],
    fills: { items: item.tags, label: 'Stack' },
    id: `project:${item.slug}`,
    kind: item.pinned ? 'Project · pinned' : 'Project',
    name: item.title,
    open: item.url,
    type: 'component',
  }
}

const kindByCompany = new Map<string, ExperienceKind>(
  groupedExperience.flatMap(({ items, kind }) =>
    items.map((item) => [item.id, kind] as const)
  )
)

const kindLabel: Record<ExperienceKind, string> = {
  freelance: 'Freelance',
  personal: 'Personal',
  research: 'Research',
  work: 'Work',
}

export const experienceKind = (company: Experience) =>
  kindLabel[kindByCompany.get(company.id) ?? 'personal']

export function experienceInfo(
  company: Experience,
  position: Position
): SelectionInfo {
  return {
    code: {
      component: 'Experience',
      props: [
        ['company', company.companyName],
        ['role', position.title],
        ['start', position.employmentPeriod.start],
        ...(position.employmentPeriod.end
          ? ([['end', position.employmentPeriod.end]] as [string, string][])
          : []),
        ['kind', experienceKind(company).toLowerCase()],
      ],
    },
    exports: company.companyWebsite
      ? [
          {
            hint: 'Website',
            href: company.companyWebsite,
            label: hostOf(company.companyWebsite),
          },
        ]
      : [],
    fields: [
      { label: 'Company', value: company.companyName },
      { label: 'Role', value: position.title },
      {
        label: 'Period',
        mono: true,
        value: formatPeriod(position.employmentPeriod),
      },
      { label: 'Kind', value: experienceKind(company) },
      ...(position.employmentType
        ? [{ label: 'Type', value: position.employmentType }]
        : []),
      { label: 'About', value: plain(position.description) },
    ],
    fills: { items: position.skills ?? [], label: 'Skills' },
    id: `experience:${company.id}:${position.id}`,
    kind: 'Experience',
    name: company.companyName,
    type: 'component',
  }
}

export function postInfo(post: PostItem): SelectionInfo {
  return {
    code: {
      component: 'Post',
      props: [
        ['title', post.title],
        ['date', isoDate(post.date)],
        ['href', post.url],
      ],
    },
    exports: [{ hint: 'Read', href: post.url, label: post.url }],
    fields: [
      { label: 'Title', value: post.title },
      { label: 'Date', mono: true, value: formatDate(post.date) },
      { label: 'About', value: post.description },
    ],
    id: `post:${post.url}`,
    kind: 'Post',
    name: post.title,
    open: post.url,
    type: 'component',
  }
}

export function testimonialInfo(item: Testimonial): SelectionInfo {
  return {
    code: {
      component: 'Testimonial',
      props: [
        ['author', item.author.name],
        ['title', item.title],
      ],
    },
    fields: [
      { label: 'Author', value: item.author.name },
      { label: 'Title', value: item.title },
    ],
    id: `testimonial:${item.author.name}`,
    kind: 'Testimonial',
    name: item.author.name,
    type: 'component',
  }
}

const socialExports = profile.socials
  .filter((s) => s.url.startsWith('http'))
  .map((s) => ({ hint: s.name, href: s.url, label: hostOf(s.url) }))

export const heroInfo: SelectionInfo = {
  code: {
    component: 'Person',
    props: [
      ['name', profile.name],
      ['handle', profile.handle],
      ['role', profile.role],
      ['company', profile.current.company],
      ['timeZone', profile.timeZone],
    ],
  },
  exports: [
    {
      hint: 'Email',
      href: `mailto:${profile.email}`,
      label: profile.email,
    },
    { hint: 'Résumé', href: '/resume.pdf', label: 'resume.pdf' },
    ...socialExports,
  ],
  fields: [
    { label: 'Name', value: profile.name },
    { label: 'Handle', mono: true, value: `@${profile.handle}` },
    { label: 'Role', value: 'Design engineer, full-stack developer' },
    {
      href: profile.current.url,
      label: 'Now',
      value: `${profile.current.title}, ${profile.current.company}`,
    },
    { label: 'Based in', value: `${profile.location} (IST, UTC+5:30)` },
  ],
  id: 'hero',
  kind: 'Frame · Hero',
  name: profile.name,
  type: 'frame',
}

export const contactInfo: SelectionInfo = {
  ...heroInfo,
  code: {
    component: 'Contact',
    props: [
      ['email', profile.email],
      ['github', profile.github],
    ],
  },
  id: 'contact',
  kind: 'Frame · Contact',
  name: 'Contact',
}

export const simbaInfo: SelectionInfo = {
  code: {
    component: 'Simba',
    props: [
      ['breed', 'Shih Tzu'],
      ['role', 'mascot'],
      ['askable', true],
    ],
  },
  fields: [
    { label: 'Name', value: 'Simba' },
    { label: 'Breed', value: 'Shih Tzu' },
    { label: 'Job', value: 'Fronts the site’s AI chat' },
    { label: 'Drawn', value: 'Line art, in this variant' },
  ],
  id: 'simba',
  kind: 'Vector · hidden layer',
  name: 'simba.svg',
  type: 'vector',
}

/** Every unique stack tag, most used first. */
export function stackTags(items: WorkItem[]) {
  const counts = new Map<string, number>()
  for (const item of items) {
    for (const tag of item.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .toSorted((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag, count]) => ({ count, tag }))
}

export const yearsBuilding = () => new Date().getFullYear() - 2018

export interface Chapter {
  body: string
  id: string
  title: string
  years: string
}

export function chapterInfo(chapter: Chapter, index: number): SelectionInfo {
  return {
    code: {
      component: 'Chapter',
      props: [
        ['anchor', index + 1],
        ['years', chapter.years],
        ['title', chapter.title],
      ],
    },
    fields: [
      { label: 'Anchor', mono: true, value: `${index + 1} of 5` },
      { label: 'Years', mono: true, value: chapter.years },
      { label: 'Title', value: chapter.title },
      { label: 'Point', value: 'Smooth, mirrored handles' },
    ],
    id: `chapter:${chapter.id}`,
    kind: 'Anchor point · Chapter',
    name: chapter.title,
    type: 'vector',
  }
}

export function toolInfo(
  tool: { description: string; name: string; url?: string },
  group: 'Hardware' | 'Software'
): SelectionInfo {
  return {
    code: {
      component: group === 'Hardware' ? 'Device' : 'App',
      props: [
        ['name', tool.name],
        ['note', tool.description],
      ],
    },
    exports: tool.url
      ? [{ hint: 'Link', href: tool.url, label: hostOf(tool.url) }]
      : [],
    fields: [
      { label: 'Name', value: tool.name },
      { label: 'Library', value: `Toolbox / ${group}` },
      { label: 'Note', value: tool.description },
    ],
    id: `tool:${group}:${tool.name}`,
    kind: `Component · ${group}`,
    name: tool.name,
    open: tool.url,
    type: 'component',
  }
}

export const introInfo: SelectionInfo = {
  ...heroInfo,
  id: 'intro',
  kind: 'Frame · Intro',
}
