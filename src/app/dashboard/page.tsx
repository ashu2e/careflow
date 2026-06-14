import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { appointments, patients, doctors, users, staff, invoices } from "@/db/schema";
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

    return <PatientDashboard patient={patientRecord} appointments={myAppointments} userName={session.user.name} />;
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

    return <DoctorDashboard doctor={doctorRecord} appointments={todayAppointments} userName={session.user.name} />;
  }

  if (role === "Admin") {
    const allPatients = await db.query.patients.findMany();
    const allDoctors = await db.query.doctors.findMany();
    const allStaff = await db.query.staff.findMany();
    const allAppointments = await db.query.appointments.findMany();
    const allInvoices = await db.query.invoices.findMany();

    const stats = {
      totalPatients: allPatients.length,
      totalDoctors: allDoctors.length,
      totalStaff: allStaff.length,
      appointments: {
        scheduled: allAppointments.filter(a => a.status === 'Scheduled').length,
        completed: allAppointments.filter(a => a.status === 'Completed').length,
        cancelled: allAppointments.filter(a => a.status === 'Cancelled').length,
      },
      revenue: {
        paid: allInvoices.filter(i => i.paymentStatus === 'Paid').reduce((acc, i) => acc + i.amount, 0),
        pending: allInvoices.filter(i => i.paymentStatus === 'Pending').reduce((acc, i) => acc + i.amount, 0),
      }
    };

    return <AdminDashboard stats={stats} userName={session.user.name} />;
  }

  if (role === "Receptionist") {
    return <ReceptionistDashboard userName={session.user.name} />;
  }

  if (role === "Pharmacist") {
    return <PharmacistDashboard userName={session.user.name} />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-4 text-gray-600">Welcome to your CareFlow dashboard.</p>
    </div>
  );
}
