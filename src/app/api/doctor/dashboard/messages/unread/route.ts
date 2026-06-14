import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { messages, users } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const unreadMessages = await db
      .select({
        id: messages.id,
        content: messages.content,
        senderName: users.fullName,
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .where(
        and(
          eq(messages.receiverId, session.user.id),
          eq(messages.isRead, false)
        )
      )
      .orderBy(desc(messages.createdAt));

    return NextResponse.json({
      count: unreadMessages.length,
      latest: unreadMessages.length > 0 ? {
        sender: unreadMessages[0].senderName,
        preview: unreadMessages[0].content
      } : null
    });

  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
