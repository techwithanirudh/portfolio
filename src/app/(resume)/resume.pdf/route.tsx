// biome-ignore-all lint/suspicious/noUnknownAttribute: `tw` is takumi's Tailwind prop
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { initSync, render } from 'takumi-pdf/no-init'
import { getResume } from '@/lib/resume'

export const dynamic = 'force-static'

// takumi-pdf/next loads the wasm through a Turbopack loader that makes the
// route trace the whole project into its function. Reading the one file by
// its exact path keeps the trace to that file.
initSync({
  module: readFileSync(
    join(process.cwd(), 'node_modules/takumi-pdf/pkg/takumi_pdf_wasm_bg.wasm')
  ),
})

const geist =
  'https://fonts.gstatic.com/s/geist/v5/gyByhwUxId8gMEwcGFWNOITd.woff2'
const geistMono =
  'https://fonts.gstatic.com/s/geistmono/v6/or3yQ6H-1_WfwkMZI_qYPLs1a-t7PU0AbeE9KK5U5Cl4PuCTfNg.woff2'

const ink = '#171717'
const muted = '#6b6b72'
const rule = '#d4d4d8'
const primary = '#3451b2'

function Section({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <section style={{ breakInside: 'avoid' }} tw='flex flex-col gap-3'>
      <h2
        style={{
          borderBottom: `1px dashed ${rule}`,
          color: muted,
          fontFamily: 'Geist Mono',
          letterSpacing: '0.12em',
          margin: 0,
          textTransform: 'uppercase',
        }}
        tw='pb-1 text-[9px]'
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

export async function GET() {
  const resume = getResume()

  const pdf = await render(
    <main
      style={{ color: ink, fontFamily: 'Geist' }}
      tw='flex flex-col gap-6 text-[12px] leading-[1.55]'
    >
      <header tw='flex flex-col gap-2'>
        <div tw='flex items-baseline justify-between'>
          <h1
            style={{ fontWeight: 500, letterSpacing: '-0.02em' }}
            tw='text-[28px]'
          >
            {resume.name}
          </h1>
          <span
            style={{ color: muted, fontFamily: 'Geist Mono' }}
            tw='text-[10px]'
          >
            {resume.location}
          </span>
        </div>
        <p style={{ color: '#404044', margin: 0 }}>{resume.description}</p>
        <ul
          style={{ color: muted, fontFamily: 'Geist Mono' }}
          tw='m-0 flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-[10px]'
        >
          {resume.links.map((link) => (
            <li key={link.url}>
              <a href={link.url} style={{ color: primary }}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </header>

      <Section title='Experience'>
        <ol tw='m-0 flex list-none flex-col gap-4 p-0'>
          {resume.experience.map((job) => (
            <li
              key={job.id}
              style={{ breakInside: 'avoid' }}
              tw='flex flex-col'
            >
              <div tw='flex items-baseline justify-between gap-4'>
                <h3 style={{ fontWeight: 500, margin: 0 }}>
                  {job.title} ·{' '}
                  {job.companyUrl ? (
                    <a href={job.companyUrl} style={{ color: primary }}>
                      {job.company}
                    </a>
                  ) : (
                    job.company
                  )}
                </h3>
                <span
                  style={{ color: muted, fontFamily: 'Geist Mono' }}
                  tw='text-[10px]'
                >
                  {job.period}
                </span>
              </div>
              {job.description ? (
                <p style={{ color: '#404044', margin: 0 }}>{job.description}</p>
              ) : null}
              {job.skills ? (
                <p
                  style={{ color: muted, fontFamily: 'Geist Mono' }}
                  tw='text-[10px]'
                >
                  {job.skills}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </Section>

      <Section title='Selected projects'>
        <ol tw='m-0 flex list-none flex-wrap gap-x-6 gap-y-3 p-0'>
          {resume.projects.map((project) => (
            <li
              key={project.url}
              style={{ breakInside: 'avoid', width: 'calc(50% - 12px)' }}
              tw='flex flex-col'
            >
              <div tw='flex items-baseline justify-between gap-2'>
                <h3 style={{ fontWeight: 500, margin: 0 }}>
                  {project.href ? (
                    <a href={project.href} style={{ color: primary }}>
                      {project.title}
                    </a>
                  ) : (
                    project.title
                  )}
                </h3>
                <span
                  style={{ color: muted, fontFamily: 'Geist Mono' }}
                  tw='text-[10px]'
                >
                  {project.year}
                </span>
              </div>
              <p style={{ color: '#404044', margin: 0 }}>
                {project.description}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section title='Stack'>
        <dl tw='m-0 flex flex-col gap-1'>
          {resume.stack.map(([category, labels]) => (
            <div key={category} tw='flex gap-4'>
              <dt
                style={{ color: muted, fontFamily: 'Geist Mono', width: 96 }}
                tw='text-[10px]'
              >
                {category}
              </dt>
              <dd style={{ color: '#404044' }} tw='m-0 flex-1'>
                {labels.join(', ')}
              </dd>
            </div>
          ))}
        </dl>
      </Section>
    </main>,
    {
      fonts: [geist, geistMono],
      lang: 'en',
      margin: 53,
      metadata: {
        authors: [resume.name],
        description: resume.description,
        title: `${resume.name} resume`,
      },
      size: 'a4',
    }
  )

  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Disposition': 'inline; filename="anirudh-sriram-resume.pdf"',
      'Content-Type': 'application/pdf',
    },
  })
}
