import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { doctors, appointments } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";

export default async function DoctorPatientsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "Doctor") {
    redirect("/dashboard");
  }

  const doctorRecord = await db.query.doctors.findFirst({
    where: eq(doctors.userId, session.user.id),
  });

  if (!doctorRecord) return <div>Doctor record not found.</div>;

  // Fetch unique patients based on appointments
  const allAppointments = await db.query.appointments.findMany({
    where: eq(appointments.doctorId, doctorRecord.id),
    orderBy: [desc(appointments.date)],
    with: {
      patient: {
        with: { user: true }
      }
    }
  });

  // Deduplicate patients manually for simplicity
  const uniquePatientsMap = new Map();
  allAppointments.forEach(apt => {
    if (apt.patient && !uniquePatientsMap.has(apt.patientId)) {
      uniquePatientsMap.set(apt.patientId, {
        patient: apt.patient,
        latestAppointment: apt
      });
    }
  });

  const uniquePatients = Array.from(uniquePatientsMap.values());

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Patients</h1>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Patient List</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender / Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Appointment</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {uniquePatients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No patients found.</td>
                </tr>
              ) : (
                uniquePatients.map(({ patient, latestAppointment }) => (
                  <tr key={patient.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.user?.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.gender} / DOB: {patient.dob}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{latestAppointment.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/dashboard/consultation/${latestAppointment.id}`} className="text-blue-600 hover:text-blue-900">
                        View EHR
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
