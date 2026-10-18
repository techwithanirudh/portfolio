import {
  boolean,
  index,
  integer,
  json,
  primaryKey,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { createTable } from './table'

export const roles = createTable('roles', {
  // TODO(slopradar): inconsistent: these columns are quoted camelCase ('canDelete', 'userId', 'commentId') while auth and guestbook use snake_case, and the index below has no portfolio_ prefix (x6 in this file), align the names in one migration or note why they are fixed
  canDelete: boolean('canDelete').notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  userId: varchar('userId', { length: 256 }).primaryKey(),
})

export const comments = createTable('comments', {
  author: varchar('author', { length: 256 }).notNull(),
  content: json('content').notNull(),
  // TODO(slopradar): redundant-modifier: primaryKey() already implies notNull, drop .notNull() (also in schema/guestbook.ts)
  id: serial('id').primaryKey().notNull(),
  page: varchar('page', { length: 256 }).notNull(),
  thread: integer('thread'),
  timestamp: timestamp('timestamp', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const rates = createTable(
  'rates',
  {
    commentId: integer('commentId').notNull(),
    like: boolean('like').notNull(),
    userId: varchar('userId', { length: 256 }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.commentId] }),
    // TODO(slopradar): prefix-rule: Postgres index names are schema-wide, so unprefixed `comment_idx` can collide with another app in this database, name it portfolio_comment_idx (also guestbook_reaction_entry_idx)
    index('comment_idx').on(table.commentId),
  ]
)
