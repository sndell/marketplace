import { newMessageRequestSchema } from '@/features/chat/schema';
import { ablyServer } from '@/lib/ably.server';
import { validateRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const data = await req.json();
  const { message, chatId, recipientId } = newMessageRequestSchema.parse(data);

  const messageData = {
    senderId: user.id,
    senderDisplayName: user.displayName,
    message,
    chatId,
  };

  await Promise.all([
    ablyServer.channels.get(`chat:${recipientId}`).publish('message', messageData),
    ablyServer.channels.get(`chat:${user.id}`).publish('message', messageData),
    prisma.message.create({ data: { content: message, chatId, senderId: user.id } }),
  ]);

  return NextResponse.json({ message: 'Message sent' }, { status: 200 });
}
