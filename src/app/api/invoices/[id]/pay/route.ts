import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { invoices } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: invoiceId } = await context.params;

    // In a real app, verify Stripe webhook instead of a direct POST
    await db.update(invoices)
      .set({ paymentStatus: "Paid" })
      .where(eq(invoices.id, invoiceId));

    return NextResponse.json({ message: "Payment recorded successfully" }, { status: 200 });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
