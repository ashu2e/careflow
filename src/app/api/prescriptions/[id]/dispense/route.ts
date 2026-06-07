import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { prescriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "Pharmacist") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: prescriptionId } = await context.params;

    await db.update(prescriptions)
      .set({ status: "Dispensed" })
      .where(eq(prescriptions.id, prescriptionId));

    return NextResponse.json({ message: "Prescription marked as dispensed" }, { status: 200 });
  } catch (error) {
    console.error("Dispense error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
