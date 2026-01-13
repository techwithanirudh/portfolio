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
  id: serial('id').primaryKey().notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  message: text('message').notNull(),
  editedAt: timestamp('edited_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const guestbookReactions = createTable(
  'guestbook_reactions',
  {
    entryId: integer('entry_id')
      .notNull()
      .references(() => guestbookEntries.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    emoji: text('emoji').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.entryId, table.userId, table.emoji] }),
    index('guestbook_reaction_entry_idx').on(table.entryId),
  ]
)
