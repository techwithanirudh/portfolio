'use client'

import Link from 'next/link'
import { HeroSection } from '@/components/layout/sections/hero'
import { Button } from '@/components/ui/button'
import { owner, repo } from '@/constants/config'

const ISSUE_URL = `https://github.com/${owner}/${repo}/issues/new`

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <>
      <HeroSection
        caption='error'
        description={
          <>
            Something on this page broke. Try again, or{' '}
            <Link
              className='text-primary underline-offset-4 hover:underline'
              href={ISSUE_URL}
              rel='noopener noreferrer'
              target='_blank'
            >
              open an issue
            </Link>{' '}
            so I can fix it.
          </>
        }
        title='Something went wrong'
      />
      <div className='container mx-auto border-line border-x'>
        <details className='screen-line-bottom font-mono text-xs'>
          <summary className='cursor-pointer select-none px-4 py-3 text-muted-foreground transition-colors hover:text-foreground'>
            error details
          </summary>
          <pre className='overflow-x-auto border-line border-t bg-card/50 p-4 text-muted-foreground'>
            {error.name}: {error.message}
            {error.digest ? `\ndigest: ${error.digest}` : ''}
          </pre>
        </details>
        <div className='grid grid-cols-2 divide-x divide-line'>
          <Button
            className='h-auto py-5 ring-0 focus-visible:outline-primary-foreground focus-visible:-outline-offset-4 active:scale-100 active:opacity-90'
            onClick={reset}
            shape='square'
          >
            Try again
          </Button>
          <Button
            className='h-auto py-5 ring-0 focus-visible:-outline-offset-4 active:scale-100 active:opacity-90'
            nativeButton={false}
            render={<Link href='/' />}
            shape='square'
            variant='ghost'
          >
            Go home
          </Button>
        </div>
      </div>
    </>
  )
}
