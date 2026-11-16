import type {Config} from 'drizzle-kit';

export default {
  schema: './src/lib/server/db/schemas.ts',
  out: './drizzle',
  driver: 'better-sqlite',
  dbCredentials: { url: './data/sistema.db' }
} satisfies Config;
