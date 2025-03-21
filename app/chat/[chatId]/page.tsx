import { Chat } from "@/features/chat";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function Page(props: { params: Promise<{ chatId: string }> }) {
  const { user } = await validateRequest();
  if (!user) return <div>nah wtf?</div>;

  const params = await props.params;

  const chat = await prisma.chat.findFirst({
    where: {
      id: params.chatId,
    },
    select: {
      messages: true,
      users: {
        include: {
          user: {
            select: {
              id: true,
              displayName: true,
              photoUrl: true,
              createdAt: true,
            },
          },
        },
      },
      listing: {
        select: {
          price: true,
          title: true,
          ListingImage: {
            select: {
              image: {
                select: {
                  url: true,
                },
              },
            },
            take: 1,
          },
          region: true,
          municipality: true,
        },
      },
    },
  });

  if (!chat) return null;

  const otherUser = chat.users.find((chatUser) => chatUser.user.id !== user.id)?.user;
  if (!otherUser) return null;

  return (
    <Chat
      user={user}
      messages={chat.messages.map((message) => {
        return {
          message: message.content,
          senderId: message.senderId,
          createdAt: message.createdAt,
        };
      })}
      otherUser={otherUser}
      listing={chat.listing}
    />
  );
}
