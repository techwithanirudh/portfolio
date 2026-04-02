import type { Metadata } from 'next'
import { Suspense } from 'react'
import { createMetadata } from '@/lib/metadata'
import { AccountFooter } from './_components/account-footer'
import { AccountSettingsSection } from './_components/account-settings-section'
import { AccountSettingsSkeleton } from './_components/account-settings-skeleton'
import { ActiveSessionsSection } from './_components/active-sessions-section'
import { ActiveSessionsSkeleton } from './_components/active-sessions-skeleton'
import { requireSession } from './_lib/session'

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
  const session = await requireSession()

  return (
    <div className='flex min-h-full w-full flex-1 flex-col p-4 md:p-6'>
      <main className='flex flex-1 flex-col gap-8'>
        <header className='space-y-2'>
          <h1 className='typography-title font-medium text-2xl'>
            Account Settings
          </h1>
          <p className='typography-body text-muted-foreground text-sm'>
            Manage your account information.
          </p>
        </header>
        <Suspense fallback={<AccountSettingsSkeleton />}>
          <AccountSettingsSection />
        </Suspense>
        <div className='space-y-4'>
          <h2 className='font-medium text-lg'>Active Sessions</h2>
          <Suspense fallback={<ActiveSessionsSkeleton />}>
            <ActiveSessionsSection />
          </Suspense>
        </div>
      </main>
      <AccountFooter email={session.user.email} />
    </div>
  )
}
