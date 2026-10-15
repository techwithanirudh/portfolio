import { GitCommitHorizontal } from 'lucide-react'
import { getGitHubContributions } from '@/lib/github-contributions'
import { profile } from '../../_shared/profile'
import { ContributionsHeatmap } from './contributions-heatmap'
import { Tile, TileHeader } from './tile'

export async function ContributionsTile() {
  const data = await getGitHubContributions()
  const total = data.reduce((sum, d) => sum + d.count, 0)
  const activeDays = data.filter((d) => d.count > 0).length

  return (
    <Tile span={8}>
      <TileHeader
        aside={
          <a
            className='vs-num text-[12px] text-[var(--muted)] transition-colors hover:text-[var(--text)]'
            href={`https://github.com/${profile.github}`}
            rel='noopener'
            target='_blank'
          >
            @{profile.github} ↗
          </a>
        }
        icon={GitCommitHorizontal}
        title='GitHub contributions'
      />
      {data.length > 0 ? (
        <>
          <div className='flex flex-wrap items-baseline gap-x-6 gap-y-1'>
            <p>
              <span className='vs-num font-semibold text-[24px] tracking-tight'>
                {total.toLocaleString('en-US')}
              </span>{' '}
              <span className='text-[13px] text-[var(--muted)]'>
                in the last year
              </span>
            </p>
            <p>
              <span className='vs-num font-medium text-[15px]'>
                {activeDays}
              </span>{' '}
              <span className='text-[13px] text-[var(--muted)]'>
                active days of {data.length}
              </span>
            </p>
          </div>
          <ContributionsHeatmap data={data} />
        </>
      ) : (
        <div className='flex flex-1 flex-col items-center justify-center gap-2 rounded-xl bg-[var(--panel-raised)] px-4 py-10 text-center'>
          <p className='font-medium text-[13px]'>
            No data from GitHub right now
          </p>
          <p className='max-w-xs text-[12px] text-[var(--muted)]'>
            The contributions API did not answer. The page retries on the next
            revalidation.
          </p>
        </div>
      )}
    </Tile>
  )
}
