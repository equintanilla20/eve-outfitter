import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL!;

const globalForDb = globalThis as unknown as {
    conn: ReturnType<typeof postgres> | undefined;
}

export const sql = globalForDb.conn ?? postgres(connectionString, { prepare: false });

if (process.env.NODE_ENV !== 'production') globalForDb.conn = sql;
