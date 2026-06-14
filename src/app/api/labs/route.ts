import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { labOrders, doctors } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "Doctor") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const doctorRecord = await db.query.doctors.findFirst({
      where: eq(doctors.userId, session.user.id)
    });

    if (!doctorRecord) {
      return NextResponse.json({ message: "Doctor record not found" }, { status: 404 });
    }

    const body = await req.json();
    const { patientId, testPanel, priority, clinicalNotes } = body;

    if (!patientId || !testPanel) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const [newOrder] = await db.insert(labOrders).values({
      patientId,
      doctorId: doctorRecord.id,
      testPanel,
      priority: priority || 'routine',
      clinicalNotes,
      status: "Pending"
    }).returning();

    return NextResponse.json({ message: "Lab order added successfully", order: newOrder }, { status: 201 });
  } catch (error) {
    console.error("Lab order error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
