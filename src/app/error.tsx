'use client'

import type { ComponentProps } from 'react'
// TODO(slopradar): misplaced-module: the root error boundary imports a page file from the (home) group, move ErrorPage to src/components/features and import it from both
import ErrorPage from './(home)/error'

const RootError = (props: ComponentProps<typeof ErrorPage>) => (
  <main className='flex flex-1'>
    <ErrorPage {...props} />
  </main>
)

export default RootError
