import Image from 'next/image'
import ReactMarkdown, { type Components } from 'react-markdown'
import { PreviewLink } from '@/components/preview-link'
import { formatDuration, formatPeriod } from '@/lib/employment-period'
import type {
  ExperienceItemType,
  ExperiencePositionItemType,
} from '@/types/experience'

const markdownComponents: Components = {
  a: ({ children, href }) =>
    href ? (
      <PreviewLink className='link-underline' href={href}>
        {children}
      </PreviewLink>
    ) : (
      children
    ),
  p: ({ children }) => children,
}

export function ExperienceRow({
  experience,
}: {
  experience: ExperienceItemType
}) {
  if (experience.positions.length === 0) {
    return null
  }

  return (
    <article className='grid gap-4 px-6 py-8 sm:grid-cols-[auto_1fr] sm:gap-6'>
      {experience.companyLogo ? (
        <Image
          alt=''
          className='size-13 shrink-0 rounded-lg border border-border bg-background object-contain p-1.5'
          height={52}
          src={experience.companyLogo}
          width={52}
        />
      ) : (
        <span className='size-13 shrink-0 rounded-lg bg-muted' />
      )}

      <div className='flex min-w-0 flex-col'>
        <h3 className='font-medium text-lg'>
          {experience.companyWebsite ? (
            <PreviewLink
              className='transition-colors hover:text-muted-foreground'
              href={experience.companyWebsite}
            >
              {experience.companyName}
            </PreviewLink>
          ) : (
            experience.companyName
          )}
          {experience.isCurrentEmployer && <NowBadge />}
        </h3>

        <ol className='divide-y divide-dashed divide-border'>
          {experience.positions.map((position) => (
            <ExperiencePosition key={position.id} position={position} />
          ))}
        </ol>
      </div>
    </article>
  )
}

function ExperiencePosition({
  position,
}: {
  position: ExperiencePositionItemType
}) {
  const { start, end } = position.employmentPeriod

  return (
    <li className='grid gap-4 py-4 first:pt-0 last:pb-0 sm:grid-cols-[1fr_auto] sm:gap-6'>
      <div className='flex min-w-0 flex-col gap-3'>
        <p className='text-muted-foreground'>{position.title}</p>

        {position.description && (
          <p className='max-w-2xl text-pretty text-muted-foreground leading-relaxed'>
            <ReactMarkdown components={markdownComponents}>
              {position.description}
            </ReactMarkdown>
          </p>
        )}

        {position.skills && position.skills.length > 0 && (
          <ul className='flex flex-wrap gap-1.5'>
            {position.skills.map((skill) => (
              <li
                className='rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-[0.7rem] text-muted-foreground'
                key={skill}
              >
                {skill}
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className='font-mono text-muted-foreground text-xs tabular-nums sm:text-right'>
        {formatPeriod(start, end)}
        <span className='block opacity-70'>{formatDuration(start, end)}</span>
      </p>
    </li>
  )
}

function NowBadge() {
  return (
    <span
      aria-label='Current role'
      className='relative ml-3 inline-flex size-3 items-center justify-center align-middle'
      role='img'
    >
      <span className='absolute inline-flex size-3 animate-ping rounded-full bg-primary opacity-40 motion-reduce:animate-none' />
      <span className='relative inline-flex size-2 rounded-full bg-primary' />
    </span>
  )
}
