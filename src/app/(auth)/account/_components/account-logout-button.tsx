'use client'

import { useRouter } from 'next/navigation'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth-client'
import { toast } from '@/lib/toast'

export function AccountLogoutButton() {
  const router = useRouter()

  return (
    <Button
      className='self-start'
      onClick={async () => {
        const { error } = await signOut()
        if (error) {
          if (error.status !== 429) {
            toast.error(
              "You're still signed in. Check your connection and try again."
            )
          }
          return
        }
        router.push('/')
        router.refresh()
      }}
      shape='square'
      variant='destructive'
    >
      <span>Sign out</span>
      <Icons.logOut
        className='icon-arrow-button size-4'
        data-icon='inline-end'
      />
    </Button>
  )
}
