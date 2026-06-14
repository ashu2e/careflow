import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { inventory } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "Pharmacist") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const inventoryId = resolvedParams.id;

    const body = await req.json();
    const { stock, price } = body;

    const updateData: any = { updatedAt: new Date() };
    if (stock !== undefined) updateData.stock = parseInt(stock, 10);
    if (price !== undefined) updateData.price = parseInt(price, 10);

    const [updatedItem] = await db.update(inventory)
      .set(updateData)
      .where(eq(inventory.id, inventoryId))
      .returning();

    return NextResponse.json({ message: "Inventory updated successfully", item: updatedItem }, { status: 200 });
  } catch (error) {
    console.error("Update inventory error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
