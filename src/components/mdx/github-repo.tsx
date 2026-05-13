import { formatDistanceToNowStrict, isValid, parseISO } from 'date-fns'
import type { ComponentType } from 'react'
import { Icons } from '@/components/icons/icons'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import {
  type GitHubRepoInput,
  getGitHubRepoDetails,
  getGitHubRepoUrl,
  parseGitHubRepoInput,
} from '@/lib/github-repo'
import { cn } from '@/lib/utils'

interface GithubRepoProps {
  className?: string
  label?: string
  repo: GitHubRepoInput
}

const compactNumber = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const formatNumber = (value: number): string => compactNumber.format(value)

const formatPushedAt = (value: string | null): string => {
  if (!value) {
    return 'No recent pushes'
  }

  const date = parseISO(value)

  if (!isValid(date)) {
    return 'No recent pushes'
  }

  return `Updated ${formatDistanceToNowStrict(date, {
    addSuffix: true,
  })}`
}

function RepoStat({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className='flex min-w-0 items-center gap-1.5 text-muted-foreground text-xs'>
      <Icon className='icon-tilt size-3.5 shrink-0' />
      <span className='font-medium text-foreground'>{value}</span>
      <span className='truncate'>{label}</span>
    </div>
  )
}

function GithubRepoFallback({
  className,
  repo,
}: {
  className?: string
  repo: GitHubRepoInput
}) {
  const parsed = parseGitHubRepoInput(repo)
  const href = getGitHubRepoUrl(parsed)

  return (
    <a
      className={cn(
        'not-prose inline-flex items-center gap-1.5 text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      href={href}
      rel='noopener noreferrer'
      target='_blank'
    >
      <Icons.githubMark className='size-4 shrink-0 text-muted-foreground' />
      <span>
        {parsed.owner}/{parsed.repo}
      </span>
    </a>
  )
}

export async function GithubRepo({ className, label, repo }: GithubRepoProps) {
  try {
    const parsed = parseGitHubRepoInput(repo)
    const details = await getGitHubRepoDetails(parsed)
    const branch = details.branch ?? details.defaultBranch
    const visibleTopics = details.topics.slice(0, 3)
    const linkLabel = label ?? details.name

    return (
      <HoverCard closeDelay={120} openDelay={120}>
        <HoverCardTrigger asChild>
          <a
            className={cn(
              'not-prose inline-flex items-center gap-1.5 text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              className
            )}
            href={details.url}
            rel='noopener noreferrer'
            target='_blank'
          >
            <Icons.githubMark className='size-4 shrink-0 text-muted-foreground' />
            <span>{linkLabel}</span>
          </a>
        </HoverCardTrigger>
        <HoverCardContent className='not-prose w-96 max-w-[calc(100vw-2rem)] border-dashed p-0 shadow-black/5 shadow-lg dark:shadow-black/20'>
          <div className='flex flex-col bg-card/60'>
            <div className='flex items-start gap-3 border-border border-b border-dashed p-4'>
              <Icons.githubMark className='mt-0.5 size-5 shrink-0 text-muted-foreground' />
              <div className='min-w-0 flex-1'>
                <a
                  className='group/github-repo inline-flex max-w-full items-center gap-1.5 font-medium text-sm'
                  href={details.url}
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  <span className='truncate'>{details.name}</span>
                  <Icons.arrowUpRight className='size-3.5 shrink-0 text-muted-foreground transition-transform will-change-transform group-hover/github-repo:scale-125' />
                </a>
                <p className='mt-1 line-clamp-2 text-pretty text-muted-foreground text-xs leading-5'>
                  {details.description ?? 'No repository description provided.'}
                </p>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-x-4 gap-y-2 border-border border-b border-dashed px-4 py-3'>
              <RepoStat
                icon={Icons.star}
                label='stars'
                value={formatNumber(details.stars)}
              />
              <RepoStat
                icon={Icons.repoForked}
                label='forks'
                value={formatNumber(details.forks)}
              />
              <RepoStat
                icon={Icons.gitBranch}
                label={details.branch ? 'branch' : 'default branch'}
                value={branch}
              />
              <RepoStat
                icon={Icons.issueOpened}
                label='open issues'
                value={formatNumber(details.openIssues)}
              />
            </div>

            <div className='flex flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-3 text-muted-foreground text-xs'>
              {details.language && (
                <span className='font-medium text-foreground'>
                  {details.language}
                </span>
              )}
              {details.license && <span>{details.license}</span>}
              <span>{formatPushedAt(details.pushedAt)}</span>
            </div>

            {visibleTopics.length > 0 && (
              <div className='flex flex-wrap gap-x-2 gap-y-1.5 border-border border-t border-dashed px-4 py-3'>
                {visibleTopics.map((topic) => (
                  <span
                    className='font-mono text-muted-foreground text-xs'
                    key={topic}
                  >
                    #{topic}
                  </span>
                ))}
              </div>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    )
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      return (
        <span className='not-prose text-destructive text-sm'>
          Unable to load GitHub repo:{' '}
          {error instanceof Error ? error.message : 'Unknown error'}
        </span>
      )
    }

    return <GithubRepoFallback className={className} repo={repo} />
  }
}

export { GithubRepo as GitHubRepo }
