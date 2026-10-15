// Adapted from chanhdai.com/src/features/portfolio/components/experiences/experience-item.tsx (MIT, © 2026 Chánh Đại). See ../NOTICES.md
import Image from 'next/image'
import type { ExperienceItemType } from '@/types/experience'
import { ExperiencePositionItem } from './experience-position-item'

export function ExperienceItem({
  experience,
}: {
  experience: ExperienceItemType
}) {
  return (
    <div
      className='group/experience border-(--line) border-b border-dashed py-5 last:border-b-0'
      id={`experience-${experience.id}`}
    >
      <div className='mb-4 flex items-center gap-3'>
        <div className='flex size-6 shrink-0 select-none items-center justify-center'>
          {experience.companyLogo ? (
            <Image
              alt=''
              aria-hidden
              className='rounded-full grayscale transition-[filter] duration-300 ease-[cubic-bezier(0.42,0,0.58,1)] group-hover/experience:grayscale-0'
              height={24}
              quality={100}
              src={experience.companyLogo}
              width={24}
            />
          ) : (
            <span className='flex size-2 rounded-full border border-(--ink-muted)' />
          )}
        </div>

        <div className='flex min-w-0 flex-1 flex-col gap-x-3 gap-y-1 sm:flex-row sm:items-baseline sm:justify-between'>
          <h3 className='font-semibold text-[20px] leading-6 tracking-tight'>
            {experience.companyWebsite ? (
              <a
                className='ds-link'
                href={experience.companyWebsite}
                rel='noopener'
                target='_blank'
              >
                {experience.companyName}
              </a>
            ) : (
              experience.companyName
            )}
          </h3>

          {experience.isCurrentEmployer && (
            <p className='ds-label flex items-center gap-1.5 text-(--redline)'>
              <span aria-hidden className='size-1.5 rounded-full bg-current' />
              Current
            </p>
          )}
        </div>
      </div>

      <div className='relative space-y-5 before:absolute before:left-3 before:h-full before:w-px before:bg-(--line-strong)/50'>
        {experience.positions.map((position) => (
          <ExperiencePositionItem key={position.id} position={position} />
        ))}
      </div>
    </div>
  )
}
