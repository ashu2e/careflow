import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "Doctor") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { appointmentId } = await req.json();

    if (!appointmentId) {
      return NextResponse.json({ message: "Missing appointmentId" }, { status: 400 });
    }

    // Usually "Start Visit" might just change status to "In Progress"
    // but our schema only has 'Scheduled', 'Completed', 'Cancelled'.
    // We'll update it to 'Completed' for simplicity of the workflow right now,
    // or we could add 'In Progress' to schema. We'll stick to 'Completed' to remove it from Queue.
    
    await db.update(appointments)
      .set({ status: 'Completed' })
      .where(eq(appointments.id, appointmentId));

    return NextResponse.json({ message: "Consultation started/completed successfully" });

  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
