'use client'

import type { ComponentProps } from 'react'
import ErrorPage from './(home)/error'

// Errors above the site layout (its own render, auth, resume) land here
const RootError = (props: ComponentProps<typeof ErrorPage>) => (
  <main className='flex flex-1'>
    <ErrorPage {...props} />
  </main>
)

export default RootError
