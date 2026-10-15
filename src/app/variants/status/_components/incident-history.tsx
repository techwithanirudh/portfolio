import { CheckCircle2, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Incident, IncidentStage } from '../_lib/timeline'

const stageTone: Record<IncidentStage, string> = {
  Identified: 'var(--text)',
  Investigating: 'var(--text)',
  Monitoring: 'var(--maintained)',
  Resolved: 'var(--ok)',
  Update: 'var(--text)',
}

/** Chapters as statuspage incidents: newest first, updates newest first. */
export function IncidentHistory({ incidents }: { incidents: Incident[] }) {
  return (
    <ol className='flex flex-col gap-4'>
      {incidents.map((incident) => (
        <li className='vs-card overflow-hidden' key={incident.id}>
          <article aria-labelledby={`${incident.id}-title`}>
            <header className='flex flex-wrap items-start justify-between gap-x-6 gap-y-3 border-[var(--line)] border-b px-4 py-4 sm:px-5'>
              <div className='flex min-w-0 items-start gap-3'>
                <span
                  aria-hidden
                  className='mt-1.5 h-4 w-1 shrink-0 rounded-full'
                  style={{ background: incident.tone }}
                />
                <div className='min-w-0'>
                  <p className='vs-num text-[11px] text-[var(--muted)]'>
                    {incident.id} · {incident.years} · {incident.duration}
                  </p>
                  <h3
                    className='mt-1 font-semibold text-[18px] tracking-tight'
                    id={`${incident.id}-title`}
                  >
                    {incident.title}
                  </h3>
                </div>
              </div>
              <span
                className='inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 font-medium text-[12px]'
                style={{
                  background: `color-mix(in srgb, ${incident.ongoing ? 'var(--maintained)' : 'var(--ok)'} 13%, transparent)`,
                  color: `color-mix(in srgb, ${incident.ongoing ? 'var(--maintained)' : 'var(--ok)'} 82%, var(--text))`,
                }}
              >
                {incident.ongoing ? (
                  <Eye aria-hidden className='size-3' strokeWidth={2.25} />
                ) : (
                  <CheckCircle2
                    aria-hidden
                    className='size-3'
                    strokeWidth={2.25}
                  />
                )}
                {incident.ongoing ? 'Monitoring' : 'Resolved'}
              </span>
            </header>
            <ol className='px-4 py-2 sm:px-5'>
              {incident.updates.map((u, i) => (
                <li
                  className='relative grid gap-x-6 gap-y-1 py-3 pl-5 sm:grid-cols-[7rem_1fr]'
                  key={`${u.stage}-${u.when}-${u.text.slice(0, 32)}`}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'absolute top-[1.15rem] left-0 size-2 rounded-full ring-4 ring-[var(--panel)]',
                      i === 0 ? '' : 'bg-[var(--line-strong)]'
                    )}
                    style={
                      i === 0 ? { background: stageTone[u.stage] } : undefined
                    }
                  />
                  {i < incident.updates.length - 1 ? (
                    <span
                      aria-hidden
                      className='absolute top-[1.65rem] bottom-[-0.85rem] left-[3.5px] w-px bg-[var(--line-strong)]'
                    />
                  ) : null}
                  <span className='vs-num pt-0.5 text-[12px] text-[var(--muted)]'>
                    {u.when}
                  </span>
                  <p className='text-[14px] text-[var(--muted)] leading-relaxed'>
                    <span
                      className='mr-1.5 font-semibold'
                      style={{ color: stageTone[u.stage] }}
                    >
                      {u.stage}
                    </span>
                    {u.text}
                  </p>
                </li>
              ))}
            </ol>
          </article>
        </li>
      ))}
    </ol>
  )
}
