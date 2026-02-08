'use client'

import { useRouter } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import { revokeSessionAction } from '../actions/revoke-session'

export function RevokeSessionButton(props: { token: string }) {
  const { token } = props
  const router = useRouter()
  const { execute, status } = useAction(revokeSessionAction, {
    onSuccess: () => {
      router.refresh()
    },
    onError: ({ error }) => {
      if (error.serverError) {
        toast.error(error.serverError)
      } else {
        toast.error('Failed to revoke session.')
      }
    },
  })

  return (
    <Button
      className='rounded-none'
      disabled={status === 'executing'}
      onClick={() => {
        execute({ token })
      }}
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
