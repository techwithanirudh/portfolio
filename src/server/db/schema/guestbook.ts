import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

import { users } from './auth'

const createTable = pgTableCreator((name) => `portfolio_${name}`)

export const guestbookEntries = createTable('guestbook_entries', {
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  editedAt: timestamp('edited_at', { withTimezone: true }),
  id: serial('id').primaryKey().notNull(),
  message: text('message').notNull(),
  name: text('name').notNull(),
  signature: text('signature'),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
})

export const guestbookReactions = createTable(
  'guestbook_reactions',
  {
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    emoji: text('emoji').notNull(),
    entryId: integer('entry_id')
      .notNull()
      .references(() => guestbookEntries.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => [
    primaryKey({ columns: [table.entryId, table.userId, table.emoji] }),
    index('guestbook_reaction_entry_idx').on(table.entryId),
  ]
)
