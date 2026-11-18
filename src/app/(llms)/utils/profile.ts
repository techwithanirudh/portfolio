import { format } from 'date-fns'
import { socials } from '@/constants/navigation'
import { pages } from '@/constants/pages'
import { experiences } from '@/constants/portfolio/experiences'
import { profile } from '@/constants/portfolio/profile'
import { groupStack } from '@/constants/portfolio/skills'
import { email, owner, tagline } from '@/constants/site'
import {
  formatPeriod,
  monthsInPeriod,
  parsePeriodDate,
} from '@/lib/employment-period'
import { url } from '@/lib/url'

const formatMonths = (total: number) => {
  const years = Math.floor(total / 12)
  const months = total % 12
  const parts = [
    years > 0 ? `${years} ${years === 1 ? 'year' : 'years'}` : '',
    months > 0 ? `${months} ${months === 1 ? 'month' : 'months'}` : '',
  ].filter(Boolean)
  return parts.join(' ') || 'under a month'
}

export const DEFAULT_EMPLOYMENT_TYPE = 'Research'

export function getProfileFactsText(now = new Date()) {
  const roles = experiences.flatMap((experience) =>
    experience.positions.map(({ employmentPeriod, employmentType, title }) => ({
      company: experience.companyName,
      end: employmentPeriod.end,
      months: Math.max(
        monthsInPeriod(employmentPeriod.start, employmentPeriod.end, now),
        0
      ),
      start: employmentPeriod.start,
      title,
      type: employmentType ?? DEFAULT_EMPLOYMENT_TYPE,
    }))
  )
  const earliest = roles.reduce((first, role) =>
    parsePeriodDate(role.start, 'first') < parsePeriodDate(first.start, 'first')
      ? role
      : first
  )
  const sinceFirst = Math.max(monthsInPeriod(earliest.start, undefined, now), 0)
  const experienceLength =
    sinceFirst >= 12
      ? `about ${formatMonths(Math.floor(sinceFirst / 12) * 12)}`
      : formatMonths(sinceFirst)
  const current = roles.filter((role) => !role.end)

  return [
    '# Quick facts',
    `Computed from the site's own data on ${now.toISOString().slice(0, 10)}.`,
    '',
    `- Name: ${owner}`,
    `- What he does: ${tagline}`,
    `- Current role: ${
      current
        .map(
          (role) =>
            `${role.title} at ${role.company} (${role.type}, ${formatPeriod(role.start, undefined, ' to ')})`
        )
        .join('; ') || 'No current role listed'
    }`,
    `- Location: ${profile.location} (pronouns ${profile.pronouns})`,
    `- Years of experience: ${experienceLength} since the first role in ${format(parsePeriodDate(earliest.start, 'first'), 'MMM yyyy')} (${earliest.title} with ${earliest.company}). Time spent in the listed roles adds up to ${formatMonths(roles.reduce((total, role) => total + role.months, 0))}.`,
    '- Experience breakdown, newest first:',
    ...roles.map(
      (role) =>
        `  - ${role.title}, ${role.company} (${role.type}): ${formatPeriod(role.start, role.end, ' to ')}, ${formatMonths(role.months)}`
    ),
    '- Stack:',
    ...groupStack().map(
      ([category, labels]) => `  - ${category}: ${labels.join(', ')}`
    ),
    `- Contact: the form at ${url(pages.contact.path)}, email ${email}, or ask Simba to open the contact form in the chat`,
    `- Elsewhere: ${socials
      .filter((social) => social.url !== `mailto:${email}`)
      .map((social) => `${social.name} (${social.url})`)
      .join(', ')}`,
    `- Resume: ${url(pages.resume.path)}`,
    '',
  ].join('\n')
}
