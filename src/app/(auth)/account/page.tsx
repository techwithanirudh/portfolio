import type { Metadata } from 'next'
import { Suspense } from 'react'
import { createMetadata } from '@/lib/metadata'
import { AccountSettingsSection } from './_components/account-settings-section'
import { AccountSettingsSkeleton } from './_components/account-settings-skeleton'
import { ActiveSessionsSection } from './_components/active-sessions-section'
import { ActiveSessionsSkeleton } from './_components/active-sessions-skeleton'

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

export default function AccountPage() {
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
    </div>
  )
}
