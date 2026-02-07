import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getLoginUrl } from '@/lib/auth-client'
import { createMetadata } from '@/lib/metadata'
import { getSession } from '@/server/auth'
import { AccountSettings } from './_components/account-settings'
import { ActiveSessions } from './_components/active-sessions'

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title: 'Account Settings',
    description: 'Manage your account information and active sessions.',
    openGraph: {
      url: '/account',
    },
    alternates: {
      canonical: '/account',
    },
  })
}

export default async function AccountPage() {
  const session = await getSession()

  if (!session?.user) {
    redirect(getLoginUrl('/account'))
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
