import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

config({ path: '.env.local' });

async function dropTables() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }
  
  const sql = neon(process.env.DATABASE_URL);
  
  console.log('Dropping existing tables to start fresh...');
  await sql`DROP TABLE IF EXISTS "invoices" CASCADE;`;
  await sql`DROP TABLE IF EXISTS "prescriptions" CASCADE;`;
  await sql`DROP TABLE IF EXISTS "appointments" CASCADE;`;
  await sql`DROP TABLE IF EXISTS "staff" CASCADE;`;
  await sql`DROP TABLE IF EXISTS "doctors" CASCADE;`;
  await sql`DROP TABLE IF EXISTS "patients" CASCADE;`;
  await sql`DROP TABLE IF EXISTS "users" CASCADE;`;
  await sql`DROP TABLE IF EXISTS "__drizzle_migrations" CASCADE;`;
  console.log('Tables dropped successfully.');
}

dropTables().catch((err) => {
  console.error('Failed to drop tables:', err);
  process.exit(1);
});
