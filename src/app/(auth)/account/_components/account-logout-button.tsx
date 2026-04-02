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
        await signOut()
        router.push('/')
        router.refresh()
      }}
      shape='square'
      variant='destructive'
    >
      <span>Log Out</span>
      <Icons.logOut
        className='icon-arrow-button size-4'
        data-icon='inline-end'
      />
    </Button>
  )
}
