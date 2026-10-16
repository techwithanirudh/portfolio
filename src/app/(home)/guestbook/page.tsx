import type { Metadata } from 'next'
import { unstable_rethrow } from 'next/navigation'
import { Suspense } from 'react'
import { WebPageJsonLd } from '@/components/json-ld'
import { Section } from '@/components/layout/sections'
import { TitleDot } from '@/components/layout/sections/hero'
import {
  SplitSection,
  SplitSectionContent,
  SplitSectionHeader,
  SplitSectionSidebar,
} from '@/components/layout/sections/split'
import { Wrapper } from '@/components/layout/wrapper'
import { ViewAnimation } from '@/components/view-animation'
import { createMetadata } from '@/lib/metadata'
import { getSession } from '@/server/auth'
import { getGuestbookEntries } from '@/server/db/queries/guestbook'
import { GuestbookEntries, GuestbookEntriesError } from './_components/entries'
import { GuestbookForm } from './_components/form'
import { GuestbookEntriesSkeleton } from './_components/skeleton'

const loadEntries = async () => {
  const session = await getSession()
  const currentUserId = session?.user.id ?? null
  const isAdmin = session?.user.role === 'admin'
  const entries = await getGuestbookEntries(currentUserId)
  return { currentUserId, entries, isAdmin }
}

async function GuestbookEntriesSection() {
  const result = await loadEntries().catch((error: unknown) => {
    // Let Next's own signals (dynamic rendering, redirects) through
    unstable_rethrow(error)
    console.error('Failed to load guestbook entries', error)
    return null
  })
  if (!result) {
    return <GuestbookEntriesError />
  }
  const { currentUserId, entries, isAdmin } = result

  return (
    <GuestbookEntries
      currentUserId={currentUserId}
      entries={entries}
      isAdmin={isAdmin}
      isSignedIn={Boolean(currentUserId)}
    />
  )
}

export default function GuestbookPage() {
  return (
    <Wrapper>
      <SplitSection>
        <SplitSectionSidebar className='px-6 py-14'>
          <SplitSectionHeader
            as='h1'
            description='Share a quick hello, a thought about the work, or a suggestion.'
            title={
              <>
                Guestbook
                <TitleDot />
              </>
            }
          />
        </SplitSectionSidebar>

        <SplitSectionContent
          className='flex w-full items-center px-6 py-14'
          inset
        >
          <ViewAnimation className='w-full' delay={0.1}>
            <GuestbookForm />
          </ViewAnimation>
        </SplitSectionContent>
      </SplitSection>
      <Section className='p-6'>
        <ViewAnimation delay={0.1}>
          <h2 className='font-medium text-xl'>Recent entries</h2>
        </ViewAnimation>
      </Section>
      <Section fill>
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
    alternates: {
      canonical: '/guestbook',
    },
    description: 'Leave a note and react to messages from other visitors.',
    openGraph: {
      url: '/guestbook',
    },
    title: 'Guestbook',
  })
}
