import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "Doctor") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: appointmentId } = await context.params;

    await db.update(appointments)
      .set({ status: "Completed" })
      .where(eq(appointments.id, appointmentId));

    return NextResponse.json({ message: "Appointment marked as completed" }, { status: 200 });
  } catch (error) {
    console.error("Appointment complete error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
