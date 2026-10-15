import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ComponentsList } from '../_components/components-list'
import { StatusPill } from '../_components/status-pill'
import { ACTIVE_WINDOW, getComponents, projectStatuses } from '../_lib/timeline'

export const metadata: Metadata = {
  description:
    'Every project Anirudh has shipped as a status-page component, with a derived status and monthly activity bars.',
  title: 'Work',
}

export default function StatusWork() {
  const { axis, items } = getComponents()
  const operational = items.filter((i) => i.status === 'operational').length

  return (
    <>
      <section
        aria-labelledby='work-title'
        className='vs-hero-glow border-[var(--line)] border-b'
      >
        <div className='mx-auto grid max-w-[1200px] gap-8 px-4 pt-12 pb-10 sm:px-6 md:pt-16 lg:grid-cols-12'>
          <div className='lg:col-span-7'>
            <p className='vs-label'>Components</p>
            <h1
              className='mt-3 font-semibold text-[34px] leading-[1.05] tracking-[-0.035em] sm:text-[40px]'
              id='work-title'
            >
              {items.length} projects,{' '}
              <span className='text-[var(--muted)]'>
                {operational} operational
              </span>
            </h1>
            <p className='mt-4 max-w-[58ch] text-[15px] text-[var(--muted)] leading-relaxed'>
              Everything I have shipped, from a 2021 game-jam platformer to the
              templates and agents I maintain now. Each row opens the case
              study.
            </p>
          </div>
          <dl className='vs-card self-end p-4 text-[13px] sm:p-5 lg:col-span-5'>
            <p className='vs-label mb-3'>How status is derived</p>
            <div className='flex flex-col gap-2.5'>
              {projectStatuses.map((s) => (
                <div className='flex items-center gap-3' key={s.status}>
                  <dt className='w-28 shrink-0'>
                    <StatusPill kind={s.status} />
                  </dt>
                  <dd className='text-[var(--muted)]'>{s.rule}</dd>
                </div>
              ))}
            </div>
            <p className='vs-num mt-4 border-[var(--line)] border-t pt-3 text-[11px] text-[var(--faint)] leading-relaxed'>
              Checked in that order, age first. Bars: one per month since the
              first launch; a project is active for {ACTIVE_WINDOW} months after
              launch, maintained ones until now.
            </p>
          </dl>
        </div>
      </section>
      <div className='mx-auto max-w-[1200px] px-4 pt-8 sm:px-6'>
        <Suspense>
          <ComponentsList axis={axis} items={items} />
        </Suspense>
      </div>
    </>
  )
}
