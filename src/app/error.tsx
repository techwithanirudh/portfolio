'use client'

import type { ComponentProps } from 'react'
import { ErrorPage } from '@/components/features/error-page'

const RootError = (props: ComponentProps<typeof ErrorPage>) => (
  <main className='flex flex-1'>
    <ErrorPage {...props} />
  </main>
)

export default RootError
