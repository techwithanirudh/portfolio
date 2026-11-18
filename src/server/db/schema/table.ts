import { pgTableCreator } from 'drizzle-orm/pg-core'

export const createTable = pgTableCreator((name) => `portfolio_${name}`)
