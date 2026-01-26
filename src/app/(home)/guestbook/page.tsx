import type { Metadata } from 'next'
import { Section } from '@/components/section'
import { ViewAnimation } from '@/components/view-animation'
import { Wrapper } from '@/components/wrapper'
import { createMetadata } from '@/lib/metadata'
import { getSession } from '@/server/auth'
import { getGuestbookEntries } from '@/server/db/queries/guestbook'
import { GuestbookEntries } from './_components/entries'
import { GuestbookForm } from './_components/form'
import { Hero } from './_components/hero'

export default async function GuestbookPage() {
  const session = await getSession()
  const currentUserId = session?.user.id
  const entries = await getGuestbookEntries(currentUserId)

  return (
    <Wrapper>
      <Section className='grid divide-y divide-dashed divide-border lg:grid-cols-2 lg:divide-x lg:divide-y-0'>
        <ViewAnimation
          className='px-6 py-10 md:py-14'
          duration={0.3}
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <Hero />
        </ViewAnimation>

        <ViewAnimation
          className='flex w-full items-center px-6 py-10 md:py-14'
          delay={0.1}
          duration={0.3}
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <GuestbookForm />
        </ViewAnimation>
      </Section>
      <Section className='p-6'>
        <ViewAnimation
          delay={0.1}
          duration={0.3}
          initial={{ opacity: 0, translateY: 6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <h2 className='font-medium text-xl'>Recent Entries</h2>
        </ViewAnimation>
      </Section>
      <Section>
        <ViewAnimation
          delay={0.15}
          duration={0.3}
          initial={{ opacity: 0, translateY: 6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <GuestbookEntries
            currentUserId={currentUserId ?? null}
            entries={entries}
            isSignedIn={Boolean(currentUserId)}
          />
        </ViewAnimation>
      </Section>
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
