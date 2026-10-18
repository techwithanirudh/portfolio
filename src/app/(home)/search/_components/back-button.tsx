'use client'

import { useRouter } from 'next/navigation'
import { Icons } from '@/components/icons/icons'

export function BackButton() {
  const router = useRouter()

  return (
    <button
      className='group inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground'
      onClick={() => router.back()}
      type='button'
    >
      <Icons.arrowLeft className='size-4 transition-transform duration-200 ease-out group-hover:-translate-x-0.5 motion-reduce:transition-none' />
      Back
    </button>
  )
}
