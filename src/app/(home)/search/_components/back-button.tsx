'use client'

import { useRouter } from 'next/navigation'
import type { ComponentProps } from 'react'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'

type BackButtonProps = ComponentProps<typeof Button> & {
  iconOnly?: boolean
  label?: string
}

export function BackButton({
  iconOnly = false,
  label = 'Back',
  size,
  ...props
}: BackButtonProps) {
  const router = useRouter()
  const resolvedSize = iconOnly ? 'icon' : (size ?? 'sm')

  return (
    <Button
      aria-label={iconOnly ? label : undefined}
      onClick={() => router.back()}
      size={resolvedSize}
      variant='ghost'
      {...props}
    >
      <Icons.arrowLeft />
      {!iconOnly && label}
    </Button>
  )
}
