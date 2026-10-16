// Adapted from braydoncoyer.dev by Braydon Coyer (no license, used with
// attribution): https://github.com/braydoncoyer/braydoncoyer.dev/blob/master/app/components/ShadowBox.tsx
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ShadowBoxProps {
  children?: ReactNode
  className?: string
  height: number
  label?: string
  width: number
}

// An inset slot a photo sits in, or that holds an icon when there is no photo
export function ShadowBox({
  children,
  className,
  label,
  width,
  height,
}: ShadowBoxProps) {
  return (
    <div className={cn('group inline-block text-center', className)}>
      <div
        className='rounded-[20px] border border-border bg-background p-2'
        style={{ height, width }}
      >
        <div className='grid h-full place-items-center rounded-xl border-2 border-foreground/5 bg-muted shadow-[inset_0_2px_1.5px_0_color-mix(in_oklab,var(--color-foreground)_8%,transparent)]'>
          {children}
        </div>
      </div>
      {label ? (
        <p className='mt-5 font-hand text-lg text-muted-foreground leading-none'>
          {label}
        </p>
      ) : null}
    </div>
  )
}
