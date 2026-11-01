import Link from 'next/link'
import type { ReactNode } from 'react'
import { Icons } from '@/components/icons/icons'
import { ViewAnimation } from '@/components/view-animation'
import { hasStatusStrip, hostname, repository } from '@/lib/project-links'
import { getNextProject, getProjectYear, type ProjectPage } from '@/lib/source'
import { staggerDelay } from '@/lib/stagger'
import { PreviewButton } from './preview-button'

export const ProjectFacts = ({ page }: { page: ProjectPage }) => {
  const { github, tags, website } = page.data
  const next = getNextProject(page)
  // Status, platform and the links show in the strip under the lead when the
  // page has one
  const inStrip = hasStatusStrip(page)
  const facts: { label: string; value: ReactNode }[] = []

  if (website && !inStrip) {
    facts.push({
      label: 'Website',
      value: (
        <PreviewButton
          className='max-w-full'
          href={website}
          icon={<Icons.globe className='size-4' />}
          label={hostname(website)}
        />
      ),
    })
  }
  facts.push({ label: 'Year', value: getProjectYear(page) })
  if (github && !inStrip) {
    facts.push({
      label: 'Source',
      value: (
        <PreviewButton
          className='max-w-full'
          href={github}
          icon={<Icons.github className='size-4' />}
          label={repository(github)}
        />
      ),
    })
  }
  if (tags?.length) {
    facts.push({
      label: 'Stack',
      value: (
        <ul className='flex flex-wrap gap-2 pt-1'>
          {tags.map((tag) => (
            <li
              className='inline-flex h-7 items-center rounded-md bg-secondary px-2.5 text-secondary-foreground text-sm'
              key={tag}
            >
              {tag}
            </li>
          ))}
        </ul>
      ),
    })
  }
  if (next) {
    facts.push({
      label: 'Next project',
      value: (
        <Link
          className='group inline-flex items-center gap-2 text-pretty'
          href={next.url}
        >
          {next.data.title}
          <Icons.arrowRight className='icon-arrow size-4 shrink-0 text-muted-foreground' />
        </Link>
      ),
    })
  }

  return (
    <dl className='flex flex-col gap-6'>
      {facts.map((fact, index) => (
        <ViewAnimation
          className='flex flex-col items-start gap-1.5'
          delay={staggerDelay(index, 0.1)}
          key={fact.label}
        >
          <dt className='text-muted-foreground text-sm'>{fact.label}</dt>
          <dd className='min-w-0 max-w-full'>{fact.value}</dd>
        </ViewAnimation>
      ))}
    </dl>
  )
}
