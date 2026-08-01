import {
  boolean,
  index,
  integer,
  json,
  pgTableCreator,
  primaryKey,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

const createTable = pgTableCreator((name) => `portfolio_${name}`)

export const roles = createTable('roles', {
  canDelete: boolean('canDelete').notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  userId: varchar('userId', { length: 256 }).primaryKey(),
})

export const comments = createTable('comments', {
  author: varchar('author', { length: 256 }).notNull(),
  content: json('content').notNull(),
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
    index('comment_idx').on(table.commentId),
  ]
)
