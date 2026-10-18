'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { githubRepoUrl } from '@/constants/config'
import { cn } from '@/lib/utils'

const LINE_BREAK = /\r?\n/

const ISSUE_URL = `${githubRepoUrl}/issues/new`

const withOccurrenceKeys = (lines: string[]) => {
  const seen = new Map<string, number>()
  return lines.map((line) => {
    const occurrence = (seen.get(line) ?? 0) + 1
    seen.set(line, occurrence)
    return { key: `${line}#${occurrence}`, line }
  })
}

interface ErrorPageProps {
  // TODO(slopradar): unchecked-type: Next 16 types `error` as unknown (file-conventions/error.md: a value thrown in a Client Component arrives as-is and may not be an Error), type it unknown and narrow with instanceof Error before reading name, message, stack and digest
  error: Error & { digest?: string }
  retry: () => void
}

const ErrorPage = ({ error, retry }: ErrorPageProps) => {
  const stackLines =
    error.stack
      ?.split(LINE_BREAK)
      .slice(1)
      .map((line) => line.trim()) ?? []
  const errorStack = withOccurrenceKeys(stackLines)

  return (
    <section
      className='flex flex-1 flex-col border-border border-b border-dashed'
      data-fill
      data-slot='section'
    >
      <div className='container relative mx-auto flex min-h-[28rem] flex-1 items-center justify-center border-border border-x border-dashed px-4 py-16'>
        <div className='flex w-full max-w-xl flex-col items-center gap-4 text-center'>
          <p className='font-mono text-muted-foreground text-xs uppercase tracking-widest'>
            Error
          </p>
          <h1 className='text-balance font-semibold text-2xl tracking-tight'>
            Something broke on this page.
          </h1>
          <div className='mt-2 flex flex-wrap justify-center gap-2'>
            <Button onClick={() => retry()}>Try again</Button>
            <Button
              nativeButton={false}
              render={<Link href='/' />}
              variant='secondary'
            >
              Go home
            </Button>
          </div>
          <details className='mt-6 w-full rounded-md border border-border text-left'>
            <summary className='cursor-pointer select-none px-3 py-2 text-muted-foreground text-sm'>
              Error details
            </summary>
            <div className='border-border border-t'>
              <code
                className={cn(
                  'flex max-h-64 flex-col gap-1 overflow-auto p-3',
                  'whitespace-pre font-mono text-[11px] leading-relaxed',
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
            <p className='border-border border-t px-3 py-2 text-muted-foreground text-sm'>
              Still broken?{' '}
              <Link
                className='link-underline'
                href={ISSUE_URL}
                // TODO(slopradar): duplicate-logic: rel and target restate externalLinkProps from @/components/external-link (same values), which no src/app file uses (x10 in src/app), spread it on a plain <a> since this is an external URL
                rel='noopener noreferrer'
                target='_blank'
              >
                Open an issue
              </Link>{' '}
              with these details.
            </p>
          </details>
        </div>
      </div>
    </section>
  )
}

export default ErrorPage
