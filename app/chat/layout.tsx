import { NotLoggedInMessage } from "@/features/auth";
import { ChatSidebar } from "@/features/chat";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AblyProvider } from "@/providers/AblyContext";

export const dynamicParams = false;

export default async function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await validateRequest();
  if (!user) return <NotLoggedInMessage />;

  const chats = await prisma.chat.findMany({
    where: {
      users: {
        some: {
          userId: user.id,
        },
      },
    },
    select: {
      id: true,
      listing: {
        select: {
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
        },
      },
      messages: {
        select: {
          content: true,
          createdAt: true,
          sender: {
            select: {
              displayName: true,
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  if (chats.length === 0) {
    return (
      <div className="h-[calc(100vh-4rem)] w-full max-w-5xl flex items-center justify-center text-lg text-primaryLight">
        No chats found
      </div>
    );
  }

  const sortedChats = chats.sort((a, b) => {
    const aTime = a.messages?.[0]?.createdAt.getTime() ?? 0;
    const bTime = b.messages?.[0]?.createdAt.getTime() ?? 0;
    return bTime - aTime;
  });

  const noMessages = sortedChats.filter((chat) => chat.messages.length === 0);
  const hasMessages = sortedChats.filter((chat) => chat.messages.length > 0);

  return (
    <div className="flex h-[calc(100vh-4rem)] max-w-7xl mx-auto">
      <AblyProvider>
        <ChatSidebar chats={[...noMessages, ...hasMessages]} userId={user.id} />
        {children}
      </AblyProvider>
    </div>
  );
}
