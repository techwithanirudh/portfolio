'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import { revokeSessionAction } from '../_actions/revoke-session'

export function RevokeSessionButton(props: { token: string }) {
  const { token } = props
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      className='rounded-none'
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const result = await revokeSessionAction({ token })
          if (!result.ok) {
            toast.error('Failed to revoke session.')
          }
        })
      }}
      size='sm'
      variant='destructive'
    >
      {isPending ? <Icons.spinner className='size-4 animate-spin' /> : null}
      Revoke
    </Button>
  )
}
