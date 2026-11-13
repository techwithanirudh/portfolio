'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, type ToasterProps } from 'sonner'
import { Icons } from '@/components/icons/icons'

// Sonner's own gaps, kept clear of the notch and home indicator
const safeOffset = (gap: string): ToasterProps['offset'] => ({
  bottom: `max(${gap}, env(safe-area-inset-bottom))`,
  left: `max(${gap}, env(safe-area-inset-left))`,
  right: `max(${gap}, env(safe-area-inset-right))`,
  top: `max(${gap}, env(safe-area-inset-top))`,
})

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
      mobileOffset={safeOffset('16px')}
      offset={safeOffset('24px')}
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
