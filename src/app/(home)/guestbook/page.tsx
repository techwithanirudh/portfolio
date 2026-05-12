import type { Metadata } from 'next'
import { Suspense } from 'react'
import { WebPageJsonLd } from '@/components/json-ld'
import { Section } from '@/components/section'
import {
  SplitSection,
  SplitSectionContent,
  SplitSectionHeader,
  SplitSectionSidebar,
} from '@/components/sections/split-section'
import { ViewAnimation } from '@/components/view-animation'
import { Wrapper } from '@/components/wrapper'
import { createMetadata } from '@/lib/metadata'
import { getSession } from '@/server/auth'
import { getGuestbookEntries } from '@/server/db/queries/guestbook'
import { GuestbookEntries } from './_components/entries'
import { GuestbookForm } from './_components/form'
import { GuestbookEntriesSkeleton } from './_components/skeleton'

async function GuestbookEntriesSection() {
  const session = await getSession()
  const currentUserId = session?.user.id ?? null
  const isAdmin = session?.user.role === 'admin'
  const entries = await getGuestbookEntries(currentUserId)

  return (
    <ViewAnimation
      delay={0.15}
      initial={{ opacity: 0, translateY: 6 }}
      whileInView={{ opacity: 1, translateY: 0 }}
    >
      <GuestbookEntries
        currentUserId={currentUserId}
        entries={entries}
        isAdmin={isAdmin}
        isSignedIn={Boolean(currentUserId)}
      />
    </ViewAnimation>
  )
}

export default function GuestbookPage() {
  return (
    <Wrapper>
      <SplitSection>
        <SplitSectionSidebar className='px-6 py-14'>
          <SplitSectionHeader
            description='Share a quick hello, a thought about the work, or a suggestion.'
            title='Guestbook'
          />
        </SplitSectionSidebar>

        <SplitSectionContent
          className='flex w-full items-center px-6 py-14'
          inset
        >
          <ViewAnimation
            className='w-full'
            delay={0.1}
            initial={{ opacity: 0, translateY: -6 }}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <GuestbookForm />
          </ViewAnimation>
        </SplitSectionContent>
      </SplitSection>
      <Section className='p-6'>
        <ViewAnimation
          delay={0.1}
          initial={{ opacity: 0, translateY: 6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <h2 className='font-medium text-xl'>Recent Entries</h2>
        </ViewAnimation>
      </Section>
      <Section>
        <Suspense fallback={<GuestbookEntriesSkeleton />}>
          <GuestbookEntriesSection />
        </Suspense>
      </Section>
      <WebPageJsonLd
        description='Leave a note and react to messages from other visitors.'
        path='/guestbook'
        title='Guestbook'
      />
    </Wrapper>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title: 'Guestbook',
    description: 'Leave a note and react to messages from other visitors.',
    openGraph: {
      url: '/guestbook',
    },
    alternates: {
      canonical: '/guestbook',
    },
  })
}
