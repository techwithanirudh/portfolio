import type { ReactNode } from 'react'

export const AccountField = ({
  children,
  label,
}: {
  children: ReactNode
  label: string
}) => (
  <div className='flex flex-col gap-2'>
    <span className='text-muted-foreground text-sm'>{label}</span>
    {children}
  </div>
)
