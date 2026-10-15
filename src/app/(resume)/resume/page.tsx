import type { Metadata } from 'next'
import Link from 'next/link'
import { Icons } from '@/components/icons/icons'
import { baseUrl } from '@/constants'
import { socials } from '@/constants/navigation'
import { experiences } from '@/constants/portfolio/experiences'
import { profile } from '@/constants/portfolio/profile'
import { technologies } from '@/constants/portfolio/skills'
import { description, owner } from '@/constants/site'
import { createMetadata } from '@/lib/metadata'
import { getSortedWork } from '@/lib/source'
import { PrintButton } from './print-button'

const PROJECT_COUNT = 6

const markdownLink = /\[([^\]]+)\]\([^)]+\)/g
// Position copy is markdown on the site; the resume only needs the words
const plainText = (markdown: string) => markdown.replace(markdownLink, '$1')

const formatPeriod = ({ start, end }: { start: string; end?: string }) =>
  `${start.replace('.', '/')} – ${end ? end.replace('.', '/') : 'Present'}`

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

const ResumeSection = ({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) => (
  <section className='break-inside-avoid-page'>
    <h2 className='mb-3 border-neutral-300 border-b pb-1 font-mono text-[11px] text-neutral-500 uppercase tracking-widest'>
      {title}
    </h2>
    {children}
  </section>
)

// Generated from the same data as the site, so it never drifts out of date
export default function ResumePage() {
  const projects = getSortedWork().slice(0, PROJECT_COUNT)
  const links = socials.filter((social) => social.name !== 'YouTube')

  return (
    <main
      className='min-h-dvh bg-neutral-100 px-4 py-8 text-neutral-900 print:bg-white print:p-0'
      data-resume
    >
      <div className='mx-auto mb-4 flex max-w-[210mm] items-center justify-between print:hidden'>
        <Link
          className='group inline-flex items-center gap-1.5 font-mono text-neutral-500 text-xs transition-colors hover:text-neutral-900'
          href='/about'
        >
          <Icons.arrowLeft className='size-3.5' />
          Back to site
        </Link>
        <PrintButton />
      </div>

      <article className='mx-auto flex max-w-[210mm] flex-col gap-6 bg-white p-[14mm] text-[13px] leading-relaxed shadow-sm print:max-w-none print:p-0 print:shadow-none'>
        <header className='flex flex-col gap-2'>
          <div className='flex flex-wrap items-baseline justify-between gap-x-4'>
            <h1 className='font-heading font-medium text-3xl tracking-tight'>
              {owner}
            </h1>
            <span className='font-mono text-neutral-500 text-xs'>
              {profile.location} · {profile.pronouns}
            </span>
          </div>
          <p className='text-neutral-700'>{description}</p>
          <ul className='flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-neutral-600'>
            <li>
              <a href={baseUrl.toString()}>{prettyUrl(baseUrl.toString())}</a>
            </li>
            {links.map((social) => (
              <li key={social.name}>
                <a href={social.url}>{prettyUrl(social.url)}</a>
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
                        <a href={experience.companyWebsite}>
                          {experience.companyName}
                        </a>
                      ) : (
                        experience.companyName
                      )}
                    </h3>
                    <span className='font-mono text-[11px] text-neutral-500 tabular-nums'>
                      {[
                        position.employmentType,
                        formatPeriod(position.employmentPeriod),
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                  </div>
                  {position.description && (
                    <p className='text-neutral-700'>
                      {plainText(position.description)}
                    </p>
                  )}
                  {position.skills?.length ? (
                    <p className='font-mono text-[11px] text-neutral-500'>
                      {position.skills.join(' · ')}
                    </p>
                  ) : null}
                </li>
              ))
            )}
          </ol>
        </ResumeSection>

        <ResumeSection title='Selected projects'>
          <ol className='grid gap-x-6 gap-y-3 sm:grid-cols-2 print:grid-cols-2'>
            {projects.map((project) => (
              <li className='break-inside-avoid' key={project.url}>
                <div className='flex items-baseline justify-between gap-2'>
                  <h3 className='font-medium'>
                    <a href={new URL(project.url, baseUrl).toString()}>
                      {project.data.title}
                    </a>
                  </h3>
                  <span className='font-mono text-[11px] text-neutral-500 tabular-nums'>
                    {new Date(project.data.date).getFullYear()}
                  </span>
                </div>
                {/* Fixed two-line blurb and one-line stack keep every card the same height */}
                <p className='line-clamp-2 min-h-[2lh] text-neutral-700'>
                  {project.data.description}
                </p>
                {project.data.tags?.length ? (
                  <p className='truncate font-mono text-[11px] text-neutral-500'>
                    {project.data.tags.join(' · ')}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </ResumeSection>

        <ResumeSection title='Stack'>
          <dl className='grid grid-cols-[auto_1fr] gap-x-4 gap-y-1'>
            {stack.map(({ category, labels }) => (
              <div className='contents' key={category}>
                <dt className='font-mono text-[11px] text-neutral-500 leading-relaxed'>
                  {category}
                </dt>
                <dd className='text-neutral-700'>{labels.join(', ')}</dd>
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
