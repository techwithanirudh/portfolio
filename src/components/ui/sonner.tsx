'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, type ToasterProps } from 'sonner'
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      className='toaster group'
      style={
        {
          '--normal-bg': 'var(--color-fd-popover)',
          '--normal-text': 'var(--color-fd-popover-foreground)',
          '--normal-border': 'var(--color-fd-border)',
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        className: "border-dashed! bg-background!",
      }}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      theme={theme as ToasterProps['theme']}
      {...props}
    />
  )
}

export { Toaster }
