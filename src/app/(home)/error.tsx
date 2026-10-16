'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { owner, repo } from '@/constants/config'
import { cn } from '@/lib/utils'

const ISSUE_URL = `https://github.com/${owner}/${repo}/issues/new`

const withOccurrenceKeys = (lines: string[]) => {
  const seen = new Map<string, number>()
  return lines.map((line) => {
    const occurrence = (seen.get(line) ?? 0) + 1
    seen.set(line, occurrence)
    return { key: `${line}#${occurrence}`, line }
  })
}

interface ErrorPageProps {
  error: Error & { digest?: string }
  retry: () => void
}

const ErrorPage = ({ error, retry }: ErrorPageProps) => {
  // biome-ignore lint/performance/useTopLevelRegex: small stack parsing on render
  const stackLines = error.stack?.split(/\r?\n/).slice(1) ?? []
  const errorStack = withOccurrenceKeys(stackLines)

  return (
    <div className='flex flex-1'>
      <div className='container relative mx-auto min-h-full border-border border-x border-dashed'>
        <div className='flex w-full flex-col gap-4 self-center px-4 py-12 sm:px-8'>
          <h1 className='typography-hero text-destructive'>
            Something went wrong
          </h1>
          <p className='text-muted-foreground'>
            <span className='font-medium text-foreground'>Whoops!</span>{' '}
            Something on this page broke.
          </p>
          <p className='-mt-2 text-muted-foreground'>
            Please{' '}
            <Link
              className='link-underline'
              href={ISSUE_URL}
              rel='noopener noreferrer'
              target='_blank'
            >
              share the details
            </Link>{' '}
            of this issue so I can fix it.
          </p>
          <details className='rounded-md border border-border'>
            <summary className='select-none px-3 py-2 font-medium'>
              Error details
            </summary>
            <div className='border-border border-t'>
              <code
                className={cn(
                  'flex flex-col gap-1 p-3',
                  'overflow-x-auto text-nowrap',
                  'whitespace-pre-line font-mono text-2xs',
                  'bg-primary/5 dark:bg-primary/10'
                )}
              >
                <span className='font-medium text-foreground'>
                  {error.name || 'Error'}: {error.message || 'Unknown error'}
                </span>
                {error.digest ? (
                  <span className='pl-3'>digest: {error.digest}</span>
                ) : null}
                {errorStack.map(({ key, line }) => (
                  <span className='pl-3' key={key}>
                    {line}
                  </span>
                ))}
              </code>
            </div>
          </details>
          <div className='mt-2 flex flex-wrap gap-2'>
            <Button onClick={() => retry()}>Try again</Button>
            <Button
              nativeButton={false}
              render={<Link aria-label='Go back home' href='/' />}
              variant='secondary'
            >
              Go home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
