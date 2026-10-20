import { socials } from '@/constants/navigation'
import { experiences } from '@/constants/portfolio/experiences'
import { profile } from '@/constants/portfolio/profile'
import { groupStack } from '@/constants/portfolio/skills'
import { description, owner } from '@/constants/site'
import { formatPeriod } from '@/lib/employment-period'
import { baseUrl } from '@/lib/metadata'
import { getSortedProjects } from '@/lib/source'

const markdownLink = /\[([^\]]+)\]\([^)]+\)/g
const urlPrefix = /^(https?:\/\/|mailto:)(www\.)?/
const trailingSlash = /\/$/

export const prettyUrl = (url: string) =>
  url.replace(urlPrefix, '').replace(trailingSlash, '')

export function getResume() {
  return {
    description,
    experience: experiences.flatMap((experience) =>
      experience.positions.map((position) => ({
        company: experience.companyName,
        companyUrl: experience.companyWebsite,
        description: position.description?.replace(markdownLink, '$1'),
        id: `${experience.id}-${position.id}`,
        period: [
          position.employmentType,
          formatPeriod(
            position.employmentPeriod.start,
            position.employmentPeriod.end
          ),
        ]
          .filter(Boolean)
          .join(' · '),
        skills: position.skills?.join(' · '),
        title: position.title,
      }))
    ),
    links: [
      { label: prettyUrl(baseUrl.toString()), url: baseUrl.toString() },
      ...socials
        .filter((social) => !social.hideOnResume)
        .map((social) => ({
          label: prettyUrl(social.url),
          url: social.url,
        })),
    ],
    location: `${profile.location} · ${profile.pronouns}`,
    name: owner,
    projects: getSortedProjects()
      .slice(0, 6)
      .map((project) => ({
        description: project.data.description,
        href: project.data.website ?? project.data.github,
        title: project.data.title,
        url: project.url,
        year: project.data.date.getFullYear(),
      })),
    stack: groupStack(),
  }
}
