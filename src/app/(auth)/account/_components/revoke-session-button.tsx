'use client'

import { useAction } from 'next-safe-action/hooks'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import { getActionErrorMessage } from '@/lib/safe-action/error-message'
import { toast } from '@/lib/toast'
import { revokeSessionAction } from '../actions/revoke-session'

export function RevokeSessionButton(props: { token: string }) {
  const { token } = props
  const { execute, isExecuting } = useAction(revokeSessionAction, {
    onError: ({ error }) => {
      toast.error(
        getActionErrorMessage(
          error,
          "That session wasn't revoked. Check your connection and try again."
        )
      )
    },
    onSuccess: () => {
      toast.success('Session revoked')
    },
  })

  return (
    <Button
      aria-label='Revoke session'
      disabled={isExecuting}
      focusableWhenDisabled
      onClick={() => {
        execute({ token })
      }}
      shape='square'
      size='sm'
      variant='destructive'
    >
      {isExecuting ? <Icons.spinner className='size-4 animate-spin' /> : null}
      Revoke
    </Button>
  )
}
