import type { Metadata } from 'next'
import { Suspense } from 'react'
import { WebPageJsonLd } from '@/components/json-ld'
import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
import Separator from '@/components/layout/sections/separator'
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
  // A database hiccup shouldn't take the heading and form down with it
  const result = await loadEntries().catch((error: unknown) => {
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
        <SplitSectionSidebar className='pt-10'>
          <SplitSectionHeader
            as='h1'
            description='Share a quick hello, a thought about the work, or a suggestion.'
            title='Guestbook'
          />
        </SplitSectionSidebar>

        <SplitSectionContent className='flex w-full items-stretch'>
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
      <Separator />
      <Section fill>
        <SectionHeader title='Recent entries' />
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
