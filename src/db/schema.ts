import { pgTable, text, timestamp, uuid, integer, date, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: ['Admin', 'Doctor', 'Patient', 'Receptionist', 'Pharmacist'] }).notNull(),
  fullName: text('full_name').notNull(),
  phone: text('phone'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const patients = pgTable('patients', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  dob: date('dob').notNull(),
  gender: text('gender', { enum: ['Male', 'Female', 'Other'] }).notNull(),
  address: text('address'),
  emergencyContact: text('emergency_contact'),
});

export const doctors = pgTable('doctors', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  specialization: text('specialization').notNull(),
  fee: integer('fee').notNull(),
  workingHours: text('working_hours'),
});

export const staff = pgTable('staff', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text('role', { enum: ['Admin', 'Receptionist', 'Pharmacist'] }).notNull(),
  department: text('department'),
});

export const appointments = pgTable('appointments', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  doctorId: uuid('doctor_id').notNull().references(() => doctors.id, { onDelete: 'cascade' }),
  date: date('date').notNull(),
  timeSlot: text('time_slot').notNull(),
  status: text('status', { enum: ['Scheduled', 'Completed', 'Cancelled'] }).default('Scheduled').notNull(),
  reason: text('reason'),
});

export const prescriptions = pgTable('prescriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  appointmentId: uuid('appointment_id').notNull().references(() => appointments.id, { onDelete: 'cascade' }),
  medicineName: text('medicine_name').notNull(),
  dosage: text('dosage').notNull(),
  duration: text('duration').notNull(),
  instructions: text('instructions'),
  status: text('status', { enum: ['Pending', 'Dispensed'] }).default('Pending').notNull(),
});

export const invoices = pgTable('invoices', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(),
  paymentStatus: text('payment_status', { enum: ['Pending', 'Paid'] }).default('Pending').notNull(),
  generatedAt: timestamp('generated_at').defaultNow().notNull(),
  pdfUrl: text('pdf_url'),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  patient: one(patients, { fields: [users.id], references: [patients.userId] }),
  doctor: one(doctors, { fields: [users.id], references: [doctors.userId] }),
  staff: one(staff, { fields: [users.id], references: [staff.userId] }),
}));

export const patientsRelations = relations(patients, ({ one, many }) => ({
  user: one(users, { fields: [patients.userId], references: [users.id] }),
  appointments: many(appointments),
  invoices: many(invoices),
}));

export const doctorsRelations = relations(doctors, ({ one, many }) => ({
  user: one(users, { fields: [doctors.userId], references: [users.id] }),
  appointments: many(appointments),
}));

export const staffRelations = relations(staff, ({ one }) => ({
  user: one(users, { fields: [staff.userId], references: [users.id] }),
}));

export const appointmentsRelations = relations(appointments, ({ one, many }) => ({
  patient: one(patients, { fields: [appointments.patientId], references: [patients.id] }),
  doctor: one(doctors, { fields: [appointments.doctorId], references: [doctors.id] }),
  prescriptions: many(prescriptions),
}));

export const prescriptionsRelations = relations(prescriptions, ({ one }) => ({
  appointment: one(appointments, { fields: [prescriptions.appointmentId], references: [appointments.id] }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  patient: one(patients, { fields: [invoices.patientId], references: [patients.id] }),
}));
