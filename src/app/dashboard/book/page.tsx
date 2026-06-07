import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { doctors, users, patients } from "@/db/schema";
import { eq } from "drizzle-orm";
import BookAppointmentForm from "./BookAppointmentForm";

export default async function BookAppointmentPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;
  let patientId = null;

  if (role === "Patient") {
    const patientRecord = await db.query.patients.findFirst({
      where: eq(patients.userId, session.user.id),
    });
    patientId = patientRecord?.id;
  }

  const allDoctors = await db.query.doctors.findMany({
    with: { user: true },
  });

  // Prepare a list of patients for Receptionist to select from
  let allPatients: any[] = [];
  if (role === "Receptionist" || role === "Admin") {
    allPatients = await db.query.patients.findMany({
      with: { user: true },
    });
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Book an Appointment</h1>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <BookAppointmentForm 
          doctors={allDoctors} 
          role={role} 
          patientId={patientId}
          allPatients={allPatients} 
        />
      </div>
    </div>
  );
}
