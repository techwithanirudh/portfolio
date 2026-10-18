'use client'

import { useRouter } from 'next/navigation'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth-client'

export function AccountLogoutButton() {
  const router = useRouter()

  return (
    <Button
      className='self-start'
      onClick={async () => {
        // TODO(slopradar): swallowed-error: better-auth's signOut resolves { error } instead of throwing (the round 2 sign-in fix), so a failed sign-out still navigates home as if it worked, check the result and toast on error
        await signOut()
        router.push('/')
        router.refresh()
      }}
      shape='square'
      variant='destructive'
    >
      <span>Log out</span>
      <Icons.logOut
        className='icon-arrow-button size-4'
        data-icon='inline-end'
      />
    </Button>
  )
}
