import { redirect } from 'next/navigation'
import { getSession } from '@/server/auth'
import { AccountSettings } from './_components/account-settings'
import { ActiveSessions } from './_components/active-sessions'

export default async function AccountPage() {
  const session = await getSession()

  if (!session?.user) {
    redirect('/login?redirectTo=%2Faccount')
  }

  return (
    <div className='flex w-full grow flex-col p-4 md:p-6'>
      <div className='w-full space-y-8'>
        <div>
          <h1 className='font-medium text-xl'>Account Settings</h1>
          <p className='text-muted-foreground text-sm'>
            Manage your account information.
          </p>
        </div>
        <AccountSettings user={session.user} />
        <div className='space-y-4'>
          <h2 className='font-medium text-lg'>Active Sessions</h2>
          <ActiveSessions currentToken={session.session.token} />
        </div>
      </div>
    </div>
  )
}
