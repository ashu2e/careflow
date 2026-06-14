import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { appointments, prescriptions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const patientId = resolvedParams.id;

    const history = await db
      .select({
        id: prescriptions.id,
        date: appointments.date,
        medication: prescriptions.medicineName,
        dosage: prescriptions.dosage,
        frequency: prescriptions.duration, // Re-using duration for frequency for now
        status: prescriptions.status
      })
      .from(prescriptions)
      .innerJoin(appointments, eq(prescriptions.appointmentId, appointments.id))
      .where(eq(appointments.patientId, patientId))
      .orderBy(desc(appointments.date));

    // Map status slightly to fit the UI mock format
    const formattedHistory = history.map(item => ({
      id: item.id,
      date: item.date,
      medication: item.medication,
      dosage: item.dosage,
      frequency: item.frequency,
      status: item.status === 'Pending' ? 'Active' : 'Completed'
    }));

    return NextResponse.json({ history: formattedHistory });

  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
