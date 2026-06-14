import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { appointments, patients, users, doctors } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "Doctor") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get doctor record
    const doctorRecord = await db.query.doctors.findFirst({
      where: eq(doctors.userId, session.user.id)
    });

    if (!doctorRecord) {
      return NextResponse.json({ message: "Doctor record not found" }, { status: 404 });
    }

    // Fetch scheduled appointments
    const scheduledAppointments = await db
      .select({
        appointmentId: appointments.id,
        patientId: patients.id,
        timeSlot: appointments.timeSlot,
        reason: appointments.reason,
        patientName: users.fullName,
        patientDob: patients.dob,
        patientGender: patients.gender,
      })
      .from(appointments)
      .innerJoin(patients, eq(appointments.patientId, patients.id))
      .innerJoin(users, eq(patients.userId, users.id))
      .where(
        and(
          eq(appointments.doctorId, doctorRecord.id),
          eq(appointments.status, 'Scheduled')
        )
      );

    // Fetch completed count
    const completedAppointments = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.doctorId, doctorRecord.id),
          eq(appointments.status, 'Completed')
        )
      );

    // Calculate ages and map to expected Queue Item format
    const patientsList = scheduledAppointments.map((apt, index) => {
      // Calculate age simply
      const dob = new Date(apt.patientDob);
      const diff_ms = Date.now() - dob.getTime();
      const age_dt = new Date(diff_ms); 
      const age = Math.abs(age_dt.getUTCFullYear() - 1970);

      return {
        id: apt.patientId, // Patient ID
        appointmentId: apt.appointmentId,
        name: apt.patientName,
        age: age,
        gender: apt.patientGender.charAt(0), // 'M' or 'F'
        token: `T-${index + 101}`, // Mock token
        arrivalTime: apt.timeSlot,
        reason: apt.reason || 'General Consultation',
        status: 'Waiting'
      };
    });

    return NextResponse.json({
      patients: patientsList,
      progress: { 
        seen: completedAppointments.length, 
        total: scheduledAppointments.length + completedAppointments.length 
      }
    });

  } catch (error) {
    console.error("Queue fetch error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
