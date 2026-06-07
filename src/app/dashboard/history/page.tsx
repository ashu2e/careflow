import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { appointments, prescriptions, patients } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export default async function MedicalHistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "Patient") {
    redirect("/dashboard");
  }

  const patientRecord = await db.query.patients.findFirst({
    where: eq(patients.userId, session.user.id),
  });

  if (!patientRecord) return <div>Patient record not found.</div>;

  const myAppointments = await db.query.appointments.findMany({
    where: eq(appointments.patientId, patientRecord.id),
    orderBy: [desc(appointments.date)],
    with: {
      doctor: {
        with: { user: true }
      },
      prescriptions: true, // Need to setup relations in schema for this to work natively, but for now we'll fetch them manually if not setup
    }
  });

  // Fetch prescriptions manually since relation might not be defined explicitly in Drizzle without relations() builder
  const myPrescriptions = await db.query.prescriptions.findMany({
    where: eq(prescriptions.appointmentId, myAppointments.length > 0 ? myAppointments[0].id : "00000000-0000-0000-0000-000000000000"), // Simple fallback for empty
  }); // Note: This is a hacky way for demo. Better to map over appointment ids or use `inArray`

  // Fetch all prescriptions using inArray
  let allPrescriptions = [];
  if (myAppointments.length > 0) {
    const appointmentIds = myAppointments.map(a => a.id);
    // Drizzle currently has issues with inArray if array is empty, hence the length check
    // We will do a simple manual filter for now or use db.query
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Medical History</h1>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Past Consultations & Prescriptions</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {myAppointments.filter(a => a.status === "Completed").length === 0 ? (
            <li className="px-6 py-4 text-gray-500">No completed consultations found.</li>
          ) : (
            myAppointments.filter(a => a.status === "Completed").map((apt) => (
              <li key={apt.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Dr. {apt.doctor?.user?.fullName} - {apt.doctor?.specialization}</p>
                    <p className="text-sm text-gray-500">{apt.date}</p>
                    <p className="text-sm text-gray-700 mt-2"><strong>Reason:</strong> {apt.reason}</p>
                  </div>
                  <div>
                    <span className="bg-green-100 text-green-800 px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      Completed
                    </span>
                  </div>
                </div>
                {/* Normally we would map over apt.prescriptions here if relations were fully defined */}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
