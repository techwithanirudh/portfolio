import { GitCommitIcon } from '@primer/octicons-react'
import { Section } from '@/components/section'
import { ViewAnimation } from '@/components/view-animation'
import { octokit, owner } from '@/lib/github'
import { cn } from '@/lib/utils'

const formatCommitMessage = (message: string) => {
  const [firstLine] = message.split('\n')
  return firstLine || message
}

const EventDate = ({ date }: { date: string | null }) => {
  if (!date) {
    return <div className='shrink-0 text-muted-foreground'>Recently</div>
  }

  return (
    <div className='shrink-0 text-muted-foreground'>
      {new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })}
    </div>
  )
}

export default async function Feed(): Promise<React.ReactElement | null> {
  try {
    const commits = await octokit.rest.repos.listCommits({
      owner,
      repo: 'portfolio',
      per_page: 15,
    })
    return (
      <Section>
        <div className='grid divide-y divide-dashed divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0'>
          <div className='bg-dashed'>
            <ViewAnimation
              blur={false}
              className='h-full'
              duration={0.3}
              initial={{ opacity: 0, translateY: -6 }}
              whileInView={{ opacity: 1, translateY: 0 }}
            >
              <div className='flex flex-col gap-1.5 p-8 sm:sticky sm:top-16'>
                <h2 className='font-semibold text-2xl'>Recently Touched</h2>
                <p className='text-muted-foreground text-sm'>
                  My latest repository commits and updates.
                </p>
              </div>
            </ViewAnimation>
          </div>
          <div className='sm:col-span-2'>
            <div
              className={cn(
                'relative flex flex-col gap-2 px-4 py-8 font-mono text-muted-foreground text-xs',
                'sm:px-8 sm:text-sm'
              )}
            >
              {commits.data.map((commit, index) => (
                <ViewAnimation
                  delay={0.05 * index}
                  initial={{ opacity: 0, translateY: -8 }}
                  key={commit.sha}
                  whileInView={{ opacity: 1, translateY: 0 }}
                >
                  <div className='flex items-center gap-4'>
                    <GitCommitIcon className='size-4 shrink-0 text-muted-foreground transition-transform hover:-rotate-12 hover:scale-125' />
                    <div className='flex-1 truncate'>
                      {formatCommitMessage(commit.commit.message)}
                    </div>
                    <EventDate date={commit.commit.author?.date ?? null} />
                  </div>
                </ViewAnimation>
              ))}
              <div className='absolute right-0 bottom-6 left-0 z-10 h-40 bg-gradient-to-b from-transparent to-backdrop' />
            </div>
          </div>
        </div>
      </Section>
    )
  } catch {
    return null
  }
}
