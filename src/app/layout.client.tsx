'use client'

import { useParams } from 'next/navigation'
import type { ReactNode } from 'react'

export function Body({
  children,
}: {
  children: ReactNode
}): React.ReactElement {
  const mode = useMode()

  return (
    <body className={mode}>
      <div className='relative flex min-h-svh flex-col overflow-x-clip'>
        {children}
      </div>
    </body>
  )
}

export function useMode(): string | undefined {
  const { slug } = useParams()
  return Array.isArray(slug) && slug.length > 0 ? slug[0] : undefined
}
