import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { invoices } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== "Receptionist" && session.user.role !== "Admin")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { patientId, amount } = body;

    if (!patientId || !amount) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const [newInvoice] = await db.insert(invoices).values({
      patientId,
      amount,
      paymentStatus: "Pending"
    }).returning();

    return NextResponse.json({ message: "Invoice generated successfully", invoice: newInvoice }, { status: 201 });
  } catch (error) {
    console.error("Invoice error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
