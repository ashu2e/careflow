import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { appointments, patients, doctors, users } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

// Specific Dashboard Views
import PatientDashboard from "./_components/PatientDashboard";
import DoctorDashboard from "./_components/DoctorDashboard";
import AdminDashboard from "./_components/AdminDashboard";
import ReceptionistDashboard from "./_components/ReceptionistDashboard";
import PharmacistDashboard from "./_components/PharmacistDashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;
  const userId = session.user.id;

  // Fetch relevant data based on role
  if (role === "Patient") {
    // Get patient record
    const patientRecord = await db.query.patients.findFirst({
      where: eq(patients.userId, userId),
    });
    
    if (!patientRecord) return <div>Patient record not found</div>;

    const myAppointments = await db.query.appointments.findMany({
      where: eq(appointments.patientId, patientRecord.id),
      orderBy: [desc(appointments.date)],
      with: {
        doctor: {
          with: { user: true }
        }
      }
    });

    return <PatientDashboard patient={patientRecord} appointments={myAppointments} />;
  }

  if (role === "Doctor") {
    const doctorRecord = await db.query.doctors.findFirst({
      where: eq(doctors.userId, userId),
    });

    if (!doctorRecord) return <div>Doctor record not found</div>;

    // Get today's appointments (simplified for demo to get all upcoming)
    const todayAppointments = await db.query.appointments.findMany({
      where: eq(appointments.doctorId, doctorRecord.id),
      orderBy: [desc(appointments.date)],
      with: {
        patient: {
          with: { user: true }
        }
      }
    });

    return <DoctorDashboard doctor={doctorRecord} appointments={todayAppointments} />;
  }

  if (role === "Admin") {
    return <AdminDashboard />;
  }

  if (role === "Receptionist") {
    return <ReceptionistDashboard />;
  }

  if (role === "Pharmacist") {
    return <PharmacistDashboard />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-4 text-gray-600">Welcome to your CareFlow dashboard.</p>
    </div>
  );
}
