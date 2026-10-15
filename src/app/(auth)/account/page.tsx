import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Section } from '@/components/layout/sections'
import {
  SplitSection,
  SplitSectionContent,
  SplitSectionHeader,
  SplitSectionSidebar,
} from '@/components/layout/sections/split'
import { Wrapper } from '@/components/layout/wrapper'
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
    title: 'Account Settings',
  })
}

export default function AccountPage() {
  return (
    <Wrapper>
      <SplitSection>
        <SplitSectionSidebar className='px-6 py-14'>
          <SplitSectionHeader
            description='Manage your account information.'
            title='Account Settings'
          />
        </SplitSectionSidebar>
        <SplitSectionContent
          className='flex w-full items-center px-6 py-14 lg:justify-end'
          inset
        >
          <AccountLogoutButton />
        </SplitSectionContent>
      </SplitSection>
      <Section>
        <Suspense fallback={<AccountSettingsSkeleton />}>
          <AccountSettingsSection />
        </Suspense>
      </Section>
      <Section className='p-6'>
        <h2 className='font-medium text-xl'>Active Sessions</h2>
      </Section>
      <Section>
        <Suspense fallback={<ActiveSessionsSkeleton />}>
          <ActiveSessionsSection />
        </Suspense>
      </Section>
    </Wrapper>
  )
}
