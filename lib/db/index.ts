import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Configure Neon with increased timeout and connection settings
const sql = neon(process.env.DATABASE_URL, {
  fetchConnectionCache: true,
  fetchOptions: {
    // Increase timeout to 30 seconds
    signal: AbortSignal.timeout(30000),
  },
});

export const db = drizzle(sql, { schema });
