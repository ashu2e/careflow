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

    const doctorRecord = await db.query.doctors.findFirst({
      where: eq(doctors.userId, session.user.id)
    });

    if (!doctorRecord) return NextResponse.json({ message: "Not found" }, { status: 404 });

    // Fetch next 2 scheduled appointments
    const upcoming = await db
      .select({
        id: appointments.id,
        timeSlot: appointments.timeSlot,
        patientName: users.fullName,
        reason: appointments.reason,
      })
      .from(appointments)
      .innerJoin(patients, eq(appointments.patientId, patients.id))
      .innerJoin(users, eq(patients.userId, users.id))
      .where(
        and(
          eq(appointments.doctorId, doctorRecord.id),
          eq(appointments.status, 'Scheduled')
        )
      )
      .limit(2);

    const appointmentsList = upcoming.map(apt => ({
      id: apt.id,
      time: apt.timeSlot,
      name: apt.patientName,
      type: apt.reason || 'Consultation'
    }));

    return NextResponse.json({ appointments: appointmentsList });

  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
