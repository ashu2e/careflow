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

  if (!existingAdmin) {
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
    console.log('Admin user seeded successfully.');
  }

  console.log('Seeding initial doctor user...');
  const existingDoctor = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, 'doctor@careflow.com'),
  });

  if (!existingDoctor) {
    const passwordHash = await bcrypt.hash('Doctor@123', 10);
    const [docUser] = await db.insert(schema.users).values({
      email: 'doctor@careflow.com',
      passwordHash,
      role: 'Doctor',
      fullName: 'Test Doctor',
      phone: '1234567891',
    }).returning();

    await db.insert(schema.doctors).values({
      userId: docUser.id,
      specialization: 'General Medicine',
      fee: 500,
    });
    console.log('Doctor user seeded successfully.');
  }

  console.log('Seeding initial receptionist user...');
  const existingReceptionist = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, 'receptionist@careflow.com'),
  });

  if (!existingReceptionist) {
    const passwordHash = await bcrypt.hash('Receptionist@123', 10);
    const [recUser] = await db.insert(schema.users).values({
      email: 'receptionist@careflow.com',
      passwordHash,
      role: 'Receptionist',
      fullName: 'Test Receptionist',
      phone: '1234567892',
    }).returning();

    await db.insert(schema.staff).values({
      userId: recUser.id,
      role: 'Receptionist',
      department: 'Front Desk',
    });
    console.log('Receptionist user seeded successfully.');
  }

  console.log('Seeding initial pharmacist user...');
  const existingPharmacist = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, 'pharmacist@careflow.com'),
  });

  if (!existingPharmacist) {
    const passwordHash = await bcrypt.hash('Pharmacist@123', 10);
    const [pharUser] = await db.insert(schema.users).values({
      email: 'pharmacist@careflow.com',
      passwordHash,
      role: 'Pharmacist',
      fullName: 'Test Pharmacist',
      phone: '1234567893',
    }).returning();

    await db.insert(schema.staff).values({
      userId: pharUser.id,
      role: 'Pharmacist',
      department: 'Pharmacy',
    });
    console.log('Pharmacist user seeded successfully.');
  }

  console.log('Seeding initial patient user...');
  const existingPatient = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, 'patient@careflow.com'),
  });

  if (!existingPatient) {
    const passwordHash = await bcrypt.hash('Patient@123', 10);
    const [patUser] = await db.insert(schema.users).values({
      email: 'patient@careflow.com',
      passwordHash,
      role: 'Patient',
      fullName: 'Test Patient',
      phone: '1234567894',
    }).returning();

    await db.insert(schema.patients).values({
      userId: patUser.id,
      dob: '1990-01-01',
      gender: 'Male',
      address: '123 Main St',
      emergencyContact: '0987654321',
    });
    console.log('Patient user seeded successfully.');
  }

  console.log('\n--- Seed Complete ---');
  console.log('Login credentials for testing:');
  console.log('Admin: admin@careflow.com / Admin@123');
  console.log('Doctor: doctor@careflow.com / Doctor@123');
  console.log('Receptionist: receptionist@careflow.com / Receptionist@123');
  console.log('Pharmacist: pharmacist@careflow.com / Pharmacist@123');
  console.log('Patient: patient@careflow.com / Patient@123');
}

seed().catch(console.error);
