'use client'

import { useRouter } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import { getActionErrorMessage } from '@/lib/safe-action/error-message'
import { toast } from '@/lib/toast'
import { revokeSessionAction } from '../actions/revoke-session'

export function RevokeSessionButton(props: { token: string }) {
  const { token } = props
  const router = useRouter()
  const { execute, status } = useAction(revokeSessionAction, {
    onError: ({ error }) => {
      toast.error(getActionErrorMessage(error, 'Failed to revoke session.'))
    },
    onSuccess: () => {
      router.refresh()
      toast.success('Session revoked.')
    },
  })

  return (
    <Button
      disabled={status === 'executing'}
      onClick={() => {
        execute({ token })
      }}
      shape='square'
      size='sm'
      variant='destructive'
    >
      {status === 'executing' ? (
        <Icons.spinner className='size-4 animate-spin' />
      ) : null}
      Revoke
    </Button>
  )
}
