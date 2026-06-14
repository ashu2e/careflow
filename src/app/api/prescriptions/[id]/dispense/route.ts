import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { prescriptions, appointments, inventory, invoices } from "@/db/schema";
import { eq, ilike } from "drizzle-orm";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "Pharmacist") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const prescriptionId = resolvedParams.id;

    // 1. Fetch prescription details with appointment
    const prescriptionRecord = await db.query.prescriptions.findFirst({
      where: eq(prescriptions.id, prescriptionId),
      with: {
        appointment: true
      }
    });

    if (!prescriptionRecord) {
      return NextResponse.json({ message: "Prescription not found" }, { status: 404 });
    }

    // 2. Mark as dispensed
    await db.update(prescriptions)
      .set({ status: "Dispensed" })
      .where(eq(prescriptions.id, prescriptionId));

    // 3. Auto-deduct inventory
    const inventoryItem = await db.query.inventory.findFirst({
      where: ilike(inventory.name, prescriptionRecord.medicineName)
    });

    let billedAmount = 0;

    if (inventoryItem) {
      const quantityToDeduct = prescriptionRecord.quantity || 1;
      await db.update(inventory)
        .set({ stock: inventoryItem.stock - quantityToDeduct })
        .where(eq(inventory.id, inventoryItem.id));
      
      billedAmount = inventoryItem.price * quantityToDeduct;
    }

    // 4. Auto-generate invoice
    if (billedAmount > 0 && prescriptionRecord.appointment?.patientId) {
      await db.insert(invoices).values({
        patientId: prescriptionRecord.appointment.patientId,
        amount: billedAmount,
        paymentStatus: 'Pending'
      });
    }

    return NextResponse.json({ message: "Prescription dispensed and billed" }, { status: 200 });
  } catch (error) {
    console.error("Dispense error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
