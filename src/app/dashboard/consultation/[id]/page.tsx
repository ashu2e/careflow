import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { appointments, patients, prescriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import PrescriptionForm from "./PrescriptionForm";

export default async function ConsultationPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "Doctor") {
    redirect("/dashboard");
  }

  const appointment = await db.query.appointments.findFirst({
    where: eq(appointments.id, params.id),
    with: {
      patient: {
        with: { user: true }
      }
    }
  });

  if (!appointment) return <div>Appointment not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Consultation</h1>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Patient Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{appointment.patient?.user?.fullName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Age / DOB</p>
            <p className="font-medium">{appointment.patient?.dob}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <p className="font-medium">{appointment.patient?.gender}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Reason for Visit</p>
            <p className="font-medium bg-gray-50 p-3 rounded mt-1 border">{appointment.reason}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Write Prescription</h2>
        <PrescriptionForm appointmentId={appointment.id} />
      </div>
    </div>
  );
}
