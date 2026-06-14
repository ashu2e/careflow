import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { inventory, invoices } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "Pharmacist") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { inventoryId, quantity, patientId } = body;

    if (!inventoryId || !quantity || !patientId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const item = await db.query.inventory.findFirst({
      where: eq(inventory.id, inventoryId)
    });

    if (!item) {
      return NextResponse.json({ message: "Medicine not found" }, { status: 404 });
    }

    const qty = parseInt(quantity, 10);
    if (item.stock < qty) {
      return NextResponse.json({ message: "Insufficient stock" }, { status: 400 });
    }

    // Deduct stock
    await db.update(inventory)
      .set({ stock: item.stock - qty })
      .where(eq(inventory.id, inventoryId));

    // Generate Invoice
    const billedAmount = item.price * qty;
    const [newInvoice] = await db.insert(invoices).values({
      patientId,
      amount: billedAmount,
      paymentStatus: 'Pending'
    }).returning();

    return NextResponse.json({ message: "Sale successful, bill generated.", invoice: newInvoice }, { status: 200 });
  } catch (error) {
    console.error("Sell error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
