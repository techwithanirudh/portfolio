import type { Metadata } from 'next'
import { Footer } from '@/components/layout/footer'
import { Section } from '@/components/layout/sections'
import { pages } from '@/constants/pages'
import { createMetadata } from '@/lib/metadata'
import { AccountLogoutButton } from './_components/account-logout-button'
import { AccountSettings } from './_components/account-settings'
import { ActiveSessions } from './_components/active-sessions'
import { requireSession } from './_lib/session'

export const metadata: Metadata = createMetadata({
  alternates: {
    canonical: pages.account.path,
  },
  description: pages.account.description,
  openGraph: {
    url: pages.account.path,
  },
  robots: { follow: false, index: false },
  title: pages.account.title,
})

export default async function AccountPage() {
  const session = await requireSession()

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
        <AccountSettings user={session.user} />
      </Section>
      <Section className='px-6 pt-6'>
        <h2 className='font-medium text-lg'>Active sessions</h2>
      </Section>
      <Section sectionClassName='flex-1'>
        <ActiveSessions currentToken={session.session.token} />
      </Section>
      <Footer />
    </>
  )
}
