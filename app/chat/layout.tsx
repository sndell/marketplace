import { AblyProvider } from "@/providers/AblyContext";
import { Suspense } from "react";
import { NotLoggedInMessage } from "@/features/auth";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChatSidebar, ChatSidebarSkeleton } from "@/features/chat";

export const revalidate = 0;

export default async function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AblyProvider>
      <Suspense fallback={<ChatSidebarSkeleton />}>
        <ChatSidebarWrapper />
      </Suspense>
      {children}
    </AblyProvider>
  );
}

const ChatSidebarWrapper = async () => {
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
        take: 1,
      },
    },
  });

  if (chats.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center w-full max-w-7xl mx-auto xs:h-[calc(100vh-4rem)] h-[calc(100dvh-10rem)] text-primaryLight text-center px-4">
        Du har inga aktiva chattar. När du kontaktar en säljare kommer chatten att visas här.
        <Link href="/" className="font-medium text-accent">
          Visa annonser
        </Link>
      </div>
    );
  }

  const sortedChats = chats.sort((a, b) => {
    const aTime = a.messages?.[0]?.createdAt.getTime() ?? a.createdAt.getTime();
    const bTime = b.messages?.[0]?.createdAt.getTime() ?? b.createdAt.getTime();
    return bTime - aTime;
  });

  return <ChatSidebar chats={sortedChats} userId={user.id} />;
};
