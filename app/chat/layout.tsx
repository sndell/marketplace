import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { NotLoggedInMessage } from "@/features/auth";
import { validateRequest } from "@/lib/auth";
import Link from "next/link";
import { ChatSidebar, ChatSidebarSkeleton } from "@/features/chat";
import { AblyProvider } from "@/providers/AblyContext";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await validateRequest();
  if (!user) return <NotLoggedInMessage />;

  return (
    <div className="flex xs:h-[calc(100vh-4rem)] h-calc-[(100dvh-6rem)] max-w-7xl mx-auto">
      <AblyProvider>
        <Suspense fallback={<ChatSidebarSkeleton />}>
          <ChatSidebarWrapper userId={user.id} />
        </Suspense>
        {children}
      </AblyProvider>
    </div>
  );
}

const ChatSidebarWrapper = async ({ userId }: { userId: string }) => {
  const chats = await prisma.chat.findMany({
    where: {
      users: {
        some: {
          userId,
        },
      },
    },
    select: {
      id: true,
      createdAt: true,
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
        take: 99,
      },
      userReads: {
        where: {
          userId,
        },
        select: {
          lastReadAt: true,
        },
      },
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
    },
  });

  if (chats.length === 0) {
    return (
      <div className="w-full">
        Du har inga aktiva chattar. När du kontaktar en säljare kommer chatten att visas här.
        <Link href="/" className="font-medium text-accent">
          Visa annonser
        </Link>
      </div>
    );
  }

  const updatedChats = chats.map((chat) => {
    const lastReadAt = chat.userReads[0]?.lastReadAt || new Date(0);

    const unreadCount = chat.messages.filter(
      (message) => message.createdAt > lastReadAt && message.sender.id !== userId
    ).length;
    const otherUser = chat.users.find((userChat) => userChat.userId !== userId)?.user || null;

    return {
      ...chat,
      unreadCount,
      otherUser,
    };
  });

  // Sort chats by the latest message or creation date (in descending order)
  const sortedChats = updatedChats.sort((a, b) => {
    const aMessage = a.messages[0];
    const bMessage = b.messages[0];

    const aTime = aMessage?.createdAt.getTime() ?? a.createdAt.getTime();
    const bTime = bMessage?.createdAt.getTime() ?? b.createdAt.getTime();
    return bTime - aTime;
  });

  return <ChatSidebar chats={sortedChats} userId={userId} />;
};
