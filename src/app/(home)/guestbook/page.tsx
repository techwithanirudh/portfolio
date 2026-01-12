import type { Metadata } from 'next'
import { desc, eq } from 'drizzle-orm'
import { Section } from '@/components/section'
import { ViewAnimation } from '@/components/view-animation'
import { Wrapper } from '@/components/wrapper'
import { createMetadata } from '@/lib/metadata'
import { getSession } from '@/server/auth'
import { db } from '@/server/db'
import { guestbookEntries, guestbookReactions } from '@/server/db/schema'
import { GuestbookEntries } from './_components/guestbook-entries'
import { GuestbookForm } from './_components/guestbook-form'
import { Hero } from './_components/hero'

interface ReactionState {
  emoji: string
  count: number
  reacted: boolean
}

const buildDefaultReactions = () => new Map<string, ReactionState>()

export default async function GuestbookPage() {
  const session = await getSession()
  const currentUserId = session?.user.id

  const rows = await db
    .select({
      id: guestbookEntries.id,
      name: guestbookEntries.name,
      message: guestbookEntries.message,
      userId: guestbookEntries.userId,
      editedAt: guestbookEntries.editedAt,
      createdAt: guestbookEntries.createdAt,
      reactionEmoji: guestbookReactions.emoji,
      reactionUserId: guestbookReactions.userId,
    })
    .from(guestbookEntries)
    .leftJoin(
      guestbookReactions,
      eq(guestbookEntries.id, guestbookReactions.entryId)
    )
    .orderBy(desc(guestbookEntries.createdAt))

  const entriesMap = new Map(
    rows.map((row) => [
      row.id,
      {
        id: row.id,
        name: row.name,
        message: row.message,
        userId: row.userId,
        editedAt: row.editedAt,
        createdAt: row.createdAt,
        reactions: buildDefaultReactions(),
      },
    ])
  )

  for (const row of rows) {
    const entry = entriesMap.get(row.id)
    if (!entry) {
      continue
    }

    if (!row.reactionEmoji) {
      continue
    }

    const emoji = row.reactionEmoji
    const reaction = entry.reactions.get(emoji) ?? {
      emoji,
      count: 0,
      reacted: false,
    }

    const reactedByUser = row.reactionUserId === currentUserId

    entry.reactions.set(emoji, {
      ...reaction,
      count: reaction.count + 1,
      reacted: reactedByUser ? true : reaction.reacted,
    })
  }

  const entries = [...entriesMap.values()].map((entry) => ({
    ...entry,
    createdAt: entry.createdAt.toISOString(),
    editedAt: entry.editedAt ? entry.editedAt.toISOString() : null,
    reactions: [...entry.reactions.values()],
  }))

  return (
    <Wrapper lenis={{}}>
      <Section className='grid divide-y divide-dashed divide-border lg:grid-cols-2 lg:divide-x lg:divide-y-0'>
        <ViewAnimation
          className='px-6 py-10 md:py-14'
          initial={{ opacity: 0, translateY: -8 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <Hero />
        </ViewAnimation>

        <ViewAnimation
          className='flex w-full items-center px-6 py-10 md:py-14'
          delay={0.4}
          initial={{ opacity: 0, translateY: -8 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <GuestbookForm />
        </ViewAnimation>
      </Section>
      <Section className='px-6 py-10 md:py-14'>
        <div className='space-y-6'>
          <h2 className='typography-title text-balance'>Recent entries</h2>
          <GuestbookEntries
            currentUserId={currentUserId ?? null}
            entries={entries}
            isSignedIn={Boolean(currentUserId)}
          />
        </div>
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
