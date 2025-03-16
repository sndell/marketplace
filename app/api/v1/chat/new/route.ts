import { newChatRequestSchema } from "@/features/chat/schema";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const { listingId } = newChatRequestSchema.parse(data);
  if (!listingId) return NextResponse.json({ error: "invalid-request", message: "Invalid data" }, { status: 400 });

  const listing = await prisma.listing.findFirst({ where: { id: listingId } });
  if (!listing) return NextResponse.json({ message: "Listing not found" }, { status: 404 });

  if (listing.creatorId === user.id)
    return NextResponse.json({ message: "You cannot message yourself" }, { status: 400 });

  const existingChat = await prisma.chat.findFirst({
    where: { listingId, users: { some: { userId: user.id } } },
    include: { users: true },
  });

  if (existingChat && existingChat.users.some(({ userId }) => userId === listing.creatorId)) {
    return NextResponse.json(`/chat/${existingChat.id}`, { status: 200 });
  }

  const chat = await prisma.chat.create({
    data: {
      listingId,
      users: { create: [{ userId: user.id }, { userId: listing.creatorId }] },
    },
  });

  return NextResponse.json(`/chat/${chat.id}`, { status: 200 });
}
