'use client'

import { useRouter } from 'next/navigation'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth-client'

export function AccountLogoutButton() {
  const router = useRouter()

  return (
    <Button
      className='group self-start rounded-none'
      onClick={async () => {
        await signOut()
        router.push('/')
        router.refresh()
      }}
      variant='secondary'
    >
      <span>Log Out</span>
      <Icons.logOut
        className='size-4 transition-transform group-hover:-rotate-45'
        data-icon='inline-end'
      />
    </Button>
  )
}
