// src/lib/db.ts
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL!

// Prevents multiple connection pools from exhausting your Supabase database limits during local hot-reloads
const globalForDb = globalThis as unknown as {
  conn: ReturnType<typeof postgres> | undefined
}

export const sql = globalForDb.conn ?? postgres(connectionString, { prepare: false })

if (process.env.NODE_ENV !== 'production') globalForDb.conn = sql