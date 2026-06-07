import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users, staff, doctors } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { fullName, email, password, phone, role, specialization, fee, department } = body;

    if (!fullName || !email || !password || !role) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Run transaction
    const newUser = await db.transaction(async (tx) => {
      const [insertedUser] = await tx.insert(users).values({
        email,
        passwordHash,
        role: role as "Admin" | "Doctor" | "Receptionist" | "Pharmacist",
        fullName,
        phone,
      }).returning();

      if (role === "Doctor") {
        await tx.insert(doctors).values({
          userId: insertedUser.id,
          specialization,
          fee: parseInt(fee, 10),
        });
      } else {
        await tx.insert(staff).values({
          userId: insertedUser.id,
          role: role as "Admin" | "Receptionist" | "Pharmacist",
          department,
        });
      }

      return insertedUser;
    });

    return NextResponse.json({ message: "Staff registered successfully", userId: newUser.id }, { status: 201 });
  } catch (error) {
    console.error("Staff registration error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
