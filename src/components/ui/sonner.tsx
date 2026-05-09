'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, type ToasterProps } from 'sonner'
import { Icons } from '@/components/icons/icons'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      className='toaster group'
      icons={{
        success: <Icons.success className='size-4' strokeWidth={2} />,
        info: <Icons.info className='size-4' strokeWidth={2} />,
        warning: <Icons.warning className='size-4' strokeWidth={2} />,
        error: <Icons.error className='size-4' strokeWidth={2} />,
        loading: (
          <Icons.spinner className='size-4 animate-spin' strokeWidth={2} />
        ),
      }}
      style={
        {
          '--normal-bg': 'var(--color-fd-popover)',
          '--normal-text': 'var(--color-fd-popover-foreground)',
          '--normal-border': 'var(--color-fd-border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      theme={theme as ToasterProps['theme']}
      toastOptions={{
        classNames: {
          toast: 'cn-toast',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
