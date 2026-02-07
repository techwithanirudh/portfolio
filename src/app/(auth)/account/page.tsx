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
      <main className='w-full space-y-8'>
        <header className='space-y-2'>
          <h1 className='typography-title font-medium text-2xl'>
            Account Settings
          </h1>
          <p className='typography-body text-muted-foreground text-sm'>
            Manage your account information.
          </p>
        </header>
        <AccountSettings user={session.user} />
        <div className='space-y-4'>
          <h2 className='font-medium text-lg'>Active Sessions</h2>
          <ActiveSessions currentToken={session.session.token} />
        </div>
      </main>
    </div>
  )
}
