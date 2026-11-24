import path from 'node:path'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { env } from '$env/dynamic/private'
import * as schema from './schemas'

const DB_PATH = path.resolve(
  env.DATABASE_PATH || path.join(process.cwd(), 'data', 'sistema.db')
)

const sqlite = new Database(DB_PATH)
export const db = drizzle(sqlite, { schema })
