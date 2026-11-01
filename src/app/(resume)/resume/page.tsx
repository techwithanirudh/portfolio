import type { Metadata } from 'next'
import { pages } from '@/constants/pages'
import { createMetadata } from '@/lib/metadata'
import { getResume } from '@/lib/resume'
import { PrintButton } from './print-button'

const linkClass =
  'text-primary underline-offset-2 hover:underline print:no-underline'

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
  const resume = getResume()

  return (
    <main
      className='flex min-h-dvh flex-col bg-background text-foreground print:block print:min-h-0 print:p-[0.55in]'
      data-resume
    >
      <div className='sticky top-0 z-10 border-border border-b border-dashed bg-background/80 backdrop-blur-sm print:hidden'>
        <div className='mx-auto flex h-14 max-w-[calc(210mm+2px)] items-center justify-end border-border border-dashed px-6 sm:border-x'>
          <PrintButton />
        </div>
      </div>

      <article className='mx-auto flex w-full max-w-[calc(210mm+2px)] flex-1 flex-col gap-6 border-border border-dashed p-6 pb-28 text-[0.8125rem] leading-relaxed sm:border-x sm:p-[14mm] md:pb-[14mm] print:max-w-none print:border-0 print:p-0'>
        <header className='flex flex-col gap-2'>
          <div className='flex flex-wrap items-baseline justify-between gap-x-4'>
            <h1 className='font-heading font-medium text-3xl tracking-tight'>
              {resume.name}
            </h1>
            <span className='font-mono text-muted-foreground text-xs'>
              {resume.location}
            </span>
          </div>
          <p className='text-foreground/80'>{resume.description}</p>
          <ul className='flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.6875rem] text-muted-foreground'>
            {resume.links.map((link) => (
              <li key={link.url}>
                <a className={linkClass} href={link.url}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </header>

        <ResumeSection title='Experience'>
          <ol className='flex flex-col gap-4'>
            {resume.experience.map((job) => (
              <li className='break-inside-avoid' key={job.id}>
                <div className='flex flex-wrap items-baseline justify-between gap-x-4'>
                  <h3 className='font-medium'>
                    {job.title} ·{' '}
                    {job.companyUrl ? (
                      <a className={linkClass} href={job.companyUrl}>
                        {job.company}
                      </a>
                    ) : (
                      job.company
                    )}
                  </h3>
                  <span className='font-mono text-[0.6875rem] text-muted-foreground tabular-nums'>
                    {job.period}
                  </span>
                </div>
                {job.description && (
                  <p className='text-foreground/80'>{job.description}</p>
                )}
                {job.skills ? (
                  <p className='font-mono text-[0.6875rem] text-muted-foreground'>
                    {job.skills}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </ResumeSection>

        <ResumeSection title='Selected projects'>
          <ol className='grid gap-x-6 gap-y-3 sm:grid-cols-2 print:grid-cols-2'>
            {resume.projects.map((project) => (
              <li className='min-w-0 break-inside-avoid' key={project.url}>
                <div className='flex items-baseline justify-between gap-2'>
                  <h3 className='font-medium'>
                    {project.href ? (
                      <a className={linkClass} href={project.href}>
                        {project.title}
                      </a>
                    ) : (
                      project.title
                    )}
                  </h3>
                  <span className='font-mono text-[0.6875rem] text-muted-foreground tabular-nums'>
                    {project.year}
                  </span>
                </div>
                <p className='line-clamp-2 min-h-[2lh] text-foreground/80'>
                  {project.description}
                </p>
              </li>
            ))}
          </ol>
        </ResumeSection>

        <ResumeSection title='Stack'>
          <dl className='grid grid-cols-[auto_1fr] gap-x-4 gap-y-1'>
            {resume.stack.map(([category, labels]) => (
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

export const metadata: Metadata = createMetadata({
  alternates: { canonical: pages.resume.path },
  description: pages.resume.description,
  openGraph: { url: pages.resume.path },
  title: pages.resume.title,
})
