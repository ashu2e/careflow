import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { prescriptions } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "Doctor") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { appointmentId, medicineName, dosage, duration, instructions } = body;

    if (!appointmentId || !medicineName || !dosage || !duration) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const [newPrescription] = await db.insert(prescriptions).values({
      appointmentId,
      medicineName,
      dosage,
      duration,
      instructions,
      status: "Pending"
    }).returning();

    return NextResponse.json({ message: "Prescription added successfully", prescription: newPrescription }, { status: 201 });
  } catch (error) {
    console.error("Prescription error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
