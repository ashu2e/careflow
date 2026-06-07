import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users, patients } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, password, phone, dob, gender, address, emergencyContact } = body;

    if (!fullName || !email || !password || !dob || !gender) {
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
        role: "Patient",
        fullName,
        phone,
      }).returning();

      await tx.insert(patients).values({
        userId: insertedUser.id,
        dob,
        gender: gender as "Male" | "Female" | "Other",
        address,
        emergencyContact,
      });

      return insertedUser;
    });

    return NextResponse.json({ message: "User registered successfully", userId: newUser.id }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
