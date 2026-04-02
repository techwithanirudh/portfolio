import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Footer } from '@/components/sections/footer'
import { createMetadata } from '@/lib/metadata'
import { AccountLogoutButton } from './_components/account-logout-button'
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
    <div className='flex min-h-full w-full flex-1 flex-col'>
      <div className='flex min-h-[calc(100dvh-4rem)] flex-1 flex-col p-4 md:p-6'>
        <main className='flex flex-1 flex-col gap-8'>
          <header className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
            <div className='space-y-2'>
              <h1 className='typography-title font-medium text-2xl'>
                Account Settings
              </h1>
              <p className='typography-body text-muted-foreground text-sm'>
                Manage your account information.
              </p>
            </div>
            <AccountLogoutButton />
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
      <div className='border-border border-t border-dashed'>
        <Footer />
      </div>
    </div>
  )
}
