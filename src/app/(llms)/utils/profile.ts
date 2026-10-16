import { differenceInMonths, format, parse } from 'date-fns'
import { socials } from '@/constants/navigation'
import { experiences } from '@/constants/portfolio/experiences'
import { profile } from '@/constants/portfolio/profile'
import { groupTechnologies } from '@/constants/portfolio/skills'
import { owner, tagline } from '@/constants/site'
import { formatPeriod } from '@/lib/employment-period'
import { url } from '@/lib/url'

const periodDate = (value: string, edge: 'start' | 'end') =>
  value.includes('.')
    ? parse(value, 'MM.yyyy', new Date())
    : parse(`${edge === 'end' ? '12' : '01'}.${value}`, 'MM.yyyy', new Date())

const monthsBetween = (start: string, end: string | undefined, now: Date) =>
  Math.max(
    differenceInMonths(
      end ? periodDate(end, 'end') : now,
      periodDate(start, 'start')
    ) + 1,
    0
  )

const formatMonths = (total: number) => {
  const years = Math.floor(total / 12)
  const months = total % 12
  const parts = [
    years > 0 ? `${years} ${years === 1 ? 'year' : 'years'}` : '',
    months > 0 ? `${months} ${months === 1 ? 'month' : 'months'}` : '',
  ].filter(Boolean)
  return parts.join(' ') || 'under a month'
}

export const toPlainPeriod = (start: string, end?: string) =>
  formatPeriod(start, end).replace(' – ', ' to ')

export const groupStack = () =>
  groupTechnologies().map(
    ([category, items]) => [category, items.map((item) => item.label)] as const
  )

const getRoles = (now: Date) =>
  experiences.flatMap((experience) =>
    experience.positions.map((position) => ({
      company: experience.companyName,
      current: !position.employmentPeriod.end,
      end: position.employmentPeriod.end,
      months: monthsBetween(
        position.employmentPeriod.start,
        position.employmentPeriod.end,
        now
      ),
      start: position.employmentPeriod.start,
      title: position.title,
      type: position.employmentType ?? 'Research',
    }))
  )

export function getProfileFactsText(now = new Date()) {
  const roles = getRoles(now)
  const earliest = roles.reduce((first, role) =>
    periodDate(role.start, 'start') < periodDate(first.start, 'start')
      ? role
      : first
  )
  const sinceFirst = monthsBetween(earliest.start, undefined, now)
  const inRoles = roles.reduce((total, role) => total + role.months, 0)
  const current = roles.filter((role) => role.current)
  const email = socials.find((social) => social.url.startsWith('mailto:'))
  const otherSocials = socials.filter((social) => social !== email)

  return `# Quick facts
Computed from the site's own data on ${now.toISOString().slice(0, 10)}.

- Name: ${owner}
- What he does: ${tagline}
- Current role: ${
    current.length
      ? current
          .map(
            (role) =>
              `${role.title} at ${role.company} (${role.type}, ${toPlainPeriod(role.start)})`
          )
          .join('; ')
      : 'No current role listed'
  }
- Location: ${profile.location} (pronouns ${profile.pronouns})
- Years of experience: ${sinceFirst >= 12 ? `about ${formatMonths(Math.floor(sinceFirst / 12) * 12)}` : formatMonths(sinceFirst)} since the first role in ${format(periodDate(earliest.start, 'start'), 'MMM yyyy')} (${earliest.title} with ${earliest.company}). Time spent in the listed roles adds up to ${formatMonths(inRoles)}.
- Experience breakdown, newest first:
${roles
  .map(
    (role) =>
      `  - ${role.title}, ${role.company} (${role.type}): ${toPlainPeriod(role.start, role.end)}, ${formatMonths(role.months)}`
  )
  .join('\n')}
- Stack:
${groupStack()
  .map(([category, labels]) => `  - ${category}: ${labels.join(', ')}`)
  .join('\n')}
- Contact: the form at ${url('/contact')}${email ? `, email ${email.url.replace('mailto:', '')}` : ''}, or ask Simba to open the contact form in the chat
- Elsewhere: ${otherSocials.map((social) => `${social.name} (${social.url})`).join(', ')}
- Resume: ${url('/resume')}
`
}
