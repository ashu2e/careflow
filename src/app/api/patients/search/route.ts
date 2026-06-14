import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { patients, users } from "@/db/schema";
import { eq, ilike } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const searchResults = await db
      .select({
        id: patients.id,
        name: users.fullName,
        dob: patients.dob,
      })
      .from(patients)
      .innerJoin(users, eq(patients.userId, users.id))
      .where(ilike(users.fullName, `%${query}%`))
      .limit(10);

    return NextResponse.json({ results: searchResults });

  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
