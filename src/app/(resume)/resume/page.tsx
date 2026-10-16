import type { Metadata } from 'next'
import Link from 'next/link'
import { Icons } from '@/components/icons/icons'
import { baseUrl } from '@/constants'
import { socials } from '@/constants/navigation'
import { experiences } from '@/constants/portfolio/experiences'
import { profile } from '@/constants/portfolio/profile'
import { technologies } from '@/constants/portfolio/skills'
import { description, owner } from '@/constants/site'
import { formatPeriod } from '@/lib/employment-period'
import { createMetadata } from '@/lib/metadata'
import { getSortedWork } from '@/lib/source'
import { PrintButton } from './print-button'

const PROJECT_COUNT = 6

const markdownLink = /\[([^\]]+)\]\([^)]+\)/g
const plainText = (markdown: string) => markdown.replace(markdownLink, '$1')

const urlPrefix = /^(https?:\/\/|mailto:)(www\.)?/
const trailingSlash = /\/$/
const prettyUrl = (url: string) =>
  url.replace(urlPrefix, '').replace(trailingSlash, '')

const stack = Object.entries(
  Object.groupBy(technologies, (item) => item.categories[0] ?? 'Other')
).map(([category, items]) => ({
  category,
  labels: (items ?? []).map((item) => item.label),
}))

const linkClass =
  'underline-offset-2 hover:underline print:text-primary print:no-underline'

const ResumeSection = ({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) => (
  <section className='break-inside-avoid-page'>
    <h2 className='mb-3 border-border border-b border-dashed pb-1 font-mono text-[0.6875rem] text-muted-foreground uppercase tracking-widest'>
      {title}
    </h2>
    {children}
  </section>
)

export default function ResumePage() {
  const projects = getSortedWork().slice(0, PROJECT_COUNT)
  const links = socials.filter((social) => social.name !== 'YouTube')

  return (
    <main
      className='flex min-h-dvh flex-col bg-background text-foreground print:block print:min-h-0 print:p-[0.55in]'
      data-resume
    >
      <div className='sticky top-0 z-10 border-border border-b border-dashed bg-background/80 backdrop-blur-sm print:hidden'>
        <div className='mx-auto flex h-14 max-w-[calc(210mm+2px)] items-center justify-between border-border border-dashed px-6 sm:border-x'>
          <Link
            className='group inline-flex items-center gap-1.5 font-mono text-muted-foreground text-xs transition-colors hover:text-foreground'
            href='/about'
          >
            <Icons.arrowLeft className='size-3.5' />
            Back to site
          </Link>
          <PrintButton />
        </div>
      </div>

      <article className='mx-auto flex w-full max-w-[calc(210mm+2px)] flex-1 flex-col gap-6 border-border border-dashed p-6 pb-28 text-[0.8125rem] leading-relaxed sm:border-x sm:p-[14mm] md:pb-[14mm] print:max-w-none print:border-0 print:p-0'>
        <header className='flex flex-col gap-2'>
          <div className='flex flex-wrap items-baseline justify-between gap-x-4'>
            <h1 className='font-heading font-medium text-3xl tracking-tight'>
              {owner}
            </h1>
            <span className='font-mono text-muted-foreground text-xs'>
              {profile.location} · {profile.pronouns}
            </span>
          </div>
          <p className='text-foreground/80'>{description}</p>
          <ul className='flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.6875rem] text-muted-foreground'>
            <li>
              <a className={linkClass} href={baseUrl.toString()}>
                {prettyUrl(baseUrl.toString())}
              </a>
            </li>
            {links.map((social) => (
              <li key={social.name}>
                <a className={linkClass} href={social.url}>
                  {prettyUrl(social.url)}
                </a>
              </li>
            ))}
          </ul>
        </header>

        <ResumeSection title='Experience'>
          <ol className='flex flex-col gap-4'>
            {experiences.flatMap((experience) =>
              experience.positions.map((position) => (
                <li
                  className='break-inside-avoid'
                  key={`${experience.id}-${position.id}`}
                >
                  <div className='flex flex-wrap items-baseline justify-between gap-x-4'>
                    <h3 className='font-medium'>
                      {position.title} ·{' '}
                      {experience.companyWebsite ? (
                        <a
                          className={linkClass}
                          href={experience.companyWebsite}
                        >
                          {experience.companyName}
                        </a>
                      ) : (
                        experience.companyName
                      )}
                    </h3>
                    <span className='font-mono text-[0.6875rem] text-muted-foreground tabular-nums'>
                      {[
                        position.employmentType,
                        formatPeriod(
                          position.employmentPeriod.start,
                          position.employmentPeriod.end
                        ),
                      ]
                        .filter(Boolean)
                        .join('\u00a0· ')}
                    </span>
                  </div>
                  {position.description && (
                    <p className='text-foreground/80'>
                      {plainText(position.description)}
                    </p>
                  )}
                  {position.skills?.length ? (
                    <p className='font-mono text-[0.6875rem] text-muted-foreground'>
                      {position.skills.join('\u00a0· ')}
                    </p>
                  ) : null}
                </li>
              ))
            )}
          </ol>
        </ResumeSection>

        <ResumeSection title='Selected projects'>
          <ol className='grid gap-x-6 gap-y-3 sm:grid-cols-2 print:grid-cols-2'>
            {projects.map((project) => {
              const href = project.data.website ?? project.data.github
              return (
                <li className='min-w-0 break-inside-avoid' key={project.url}>
                  <div className='flex items-baseline justify-between gap-2'>
                    <h3 className='font-medium'>
                      {href ? (
                        <a className={linkClass} href={href}>
                          {project.data.title}
                        </a>
                      ) : (
                        project.data.title
                      )}
                    </h3>
                    <span className='font-mono text-[0.6875rem] text-muted-foreground tabular-nums'>
                      {new Date(project.data.date).getFullYear()}
                    </span>
                  </div>
                  <p className='line-clamp-2 min-h-[2lh] text-foreground/80'>
                    {project.data.description}
                  </p>
                </li>
              )
            })}
          </ol>
        </ResumeSection>

        <ResumeSection title='Stack'>
          <dl className='grid grid-cols-[auto_1fr] gap-x-4 gap-y-1'>
            {stack.map(({ category, labels }) => (
              <div className='contents' key={category}>
                <dt className='font-mono text-[0.6875rem] text-muted-foreground leading-relaxed'>
                  {category}
                </dt>
                <dd className='text-foreground/80'>{labels.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </ResumeSection>
      </article>
    </main>
  )
}

export function generateMetadata(): Metadata {
  return createMetadata({
    alternates: { canonical: '/resume' },
    description: `Resume of ${owner}: experience, selected projects and stack.`,
    openGraph: { url: '/resume' },
    title: 'Resume',
  })
}
