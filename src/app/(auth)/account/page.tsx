import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Footer } from '@/components/layout/footer'
import { Section } from '@/components/layout/sections'
import { createMetadata } from '@/lib/metadata'
import { AccountLogoutButton } from './_components/account-logout-button'
import { AccountSettingsSection } from './_components/account-settings-section'
import { AccountSettingsSkeleton } from './_components/account-settings-skeleton'
import { ActiveSessionsSection } from './_components/active-sessions-section'
import { ActiveSessionsSkeleton } from './_components/active-sessions-skeleton'

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    alternates: {
      canonical: '/account',
    },
    description: 'Manage your account information and active sessions.',
    openGraph: {
      url: '/account',
    },
    robots: { follow: false, index: false },
    title: 'Account settings',
  })
}

export default function AccountPage() {
  return (
    <>
      <Section className='px-6 py-10 sm:py-14'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div className='space-y-2'>
            <h1 className='typography-title font-medium text-3xl tracking-tight'>
              Account settings
            </h1>
            <p className='typography-body text-muted-foreground text-sm'>
              Manage your account information.
            </p>
          </div>
          <AccountLogoutButton />
        </div>
      </Section>
      <Section>
        <Suspense fallback={<AccountSettingsSkeleton />}>
          <AccountSettingsSection />
        </Suspense>
      </Section>
      <Section className='px-6 pt-6'>
        <h2 className='font-medium text-lg'>Active sessions</h2>
      </Section>
      <Section sectionClassName='flex-1'>
        <Suspense fallback={<ActiveSessionsSkeleton />}>
          <ActiveSessionsSection />
        </Suspense>
      </Section>
      <Footer />
    </>
  )
}
