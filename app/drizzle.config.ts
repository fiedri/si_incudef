import path from 'node:path';
import type {Config} from 'drizzle-kit';

const DB_PATH = path.resolve(
  process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'sistema.db')
);

export default {
  schema: './src/lib/server/db/schemas.ts',
  out: './drizzle',
  driver: 'better-sqlite',
  dbCredentials: { url: DB_PATH }
} satisfies Config;
