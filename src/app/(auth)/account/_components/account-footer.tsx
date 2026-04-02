'use client'

import { useRouter } from 'next/navigation'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth-client'

interface AccountFooterProps {
  email: string
}

export function AccountFooter({ email }: AccountFooterProps) {
  const router = useRouter()

  return (
    <footer className='mt-8 flex flex-col items-start justify-between gap-4 border-border border-t border-dashed pt-6 text-muted-foreground text-sm sm:flex-row sm:items-center'>
      <div className='flex flex-col gap-1'>
        <p className='font-medium text-foreground'>Signed in as {email}</p>
        <p>Manage your account here, then head back whenever you are done.</p>
      </div>
      <Button
        className='group rounded-none'
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
    </footer>
  )
}
