import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { inventory } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const items = await db.select().from(inventory).orderBy(desc(inventory.updatedAt));
    return NextResponse.json({ inventory: items }, { status: 200 });
  } catch (error) {
    console.error("Fetch inventory error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "Pharmacist") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, stock, threshold, price } = body;

    if (!name || stock === undefined || price === undefined) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const [newItem] = await db.insert(inventory).values({
      name,
      stock: parseInt(stock, 10),
      threshold: threshold ? parseInt(threshold, 10) : 100,
      price: parseInt(price, 10)
    }).returning();

    return NextResponse.json({ message: "Medicine added successfully", item: newItem }, { status: 201 });
  } catch (error) {
    console.error("Add medicine error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
