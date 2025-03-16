// File: app/api/v1/message/read/route.ts
import { readChatRequestSchema } from "@/features/chat/schema";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const { chatId } = readChatRequestSchema.parse(data);
  if (!chatId) return NextResponse.json({ error: "invalid-request", message: "Invalid data" }, { status: 400 });

  const chat = await prisma.chat.findFirst({ where: { id: chatId } });
  if (!chat) return NextResponse.json({ message: "Chat not found" }, { status: 404 });

  // Update or create the read timestamp
  await prisma.userChatRead.upsert({
    where: {
      userId_chatId: {
        userId: user.id,
        chatId,
      },
    },
    update: {
      lastReadAt: new Date(),
    },
    create: {
      userId: user.id,
      chatId,
      lastReadAt: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}
