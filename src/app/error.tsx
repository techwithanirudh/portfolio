'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/section'
import { cn } from '@/lib/utils'
import { owner, repo } from '@/constants/github'

const ISSUE_URL =
  `https://github.com/${owner}/${repo}/issues/new`

const ErrorPage = ({ error }: { error: Error }) => {
  const errorStack = error.stack?.split(/\r?\n/).slice(1) ?? []

  return (
    <main className='flex flex-1'>
      <div className='container relative mx-auto min-h-full border-border border-x border-dashed'>
        <div className='flex w-full flex-col gap-4 px-4 py-12 sm:px-8 self-center'>
          <h1 className='typography-hero text-destructive'>
            Something went wrong
          </h1>
          <p className='text-muted-foreground'>
            <span className='font-medium text-foreground'>Whoops!</span>{' '}
            Unfortunately an unexpected error occurred.
          </p>
          <p className='-mt-2 text-muted-foreground'>
            Please{' '}
            <Link
              className='text-primary underline-offset-4 hover:underline'
              href={ISSUE_URL}
              target='_blank'
              rel='noopener noreferrer'
            >
              share the details
            </Link>{' '}
            of this issue, so I can fix it for you.
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
                  'text-2xs font-mono whitespace-pre-line',
                  'bg-primary/5 dark:bg-primary/10'
                )}
              >
                <span className='font-medium text-foreground'>
                  {error.name || 'Error'}: {error.message || 'Unknown error'}
                </span>
                {errorStack.map((line, index) => (
                  <span key={`${line}-${index}`} className='pl-3'>
                    {line}
                  </span>
                ))}
              </code>
            </div>
          </details>
          <Button asChild className='mt-2 w-fit'>
            <Link href='/' aria-label='Go back home'>
              Go home
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

export default ErrorPage
