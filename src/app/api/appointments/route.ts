import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { doctorId, patientId, date, timeSlot, reason } = body;

    if (!doctorId || !patientId || !date || !timeSlot) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Check if slot is already booked for this doctor
    const existingBooking = await db.query.appointments.findFirst({
      where: and(
        eq(appointments.doctorId, doctorId),
        eq(appointments.date, date),
        eq(appointments.timeSlot, timeSlot)
      )
    });

    if (existingBooking) {
      return NextResponse.json({ message: "This time slot is already booked for the selected doctor." }, { status: 400 });
    }

    const [newAppointment] = await db.insert(appointments).values({
      patientId,
      doctorId,
      date,
      timeSlot,
      reason,
      status: "Scheduled"
    }).returning();

    // In a real app, send email/SMS confirmation here
    console.log(`Email sent to patient and doctor regarding appointment ${newAppointment.id}`);

    return NextResponse.json({ message: "Appointment booked successfully", appointment: newAppointment }, { status: 201 });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
