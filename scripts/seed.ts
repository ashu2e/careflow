import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/db/schema';
import bcrypt from 'bcryptjs';

config({ path: '.env.local' });

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set');
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  console.log('Seeding initial admin user...');

  const existingAdmin = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, 'admin@careflow.com'),
  });

  if (existingAdmin) {
    console.log('Admin user already exists.');
    return;
  }

  const passwordHash = await bcrypt.hash('Admin@123', 10);

  const [adminUser] = await db.insert(schema.users).values({
    email: 'admin@careflow.com',
    passwordHash,
    role: 'Admin',
    fullName: 'System Administrator',
    phone: '1234567890',
  }).returning();

  await db.insert(schema.staff).values({
    userId: adminUser.id,
    role: 'Admin',
    department: 'Management',
  });

  console.log('Admin user seeded successfully. Email: admin@careflow.com / Password: Admin@123');
}

seed().catch(console.error);
