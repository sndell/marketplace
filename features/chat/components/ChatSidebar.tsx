"use client";

import { cn } from "@/util/cn";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { useAbly } from "@/providers/AblyContext";
import { useMutation } from "@tanstack/react-query";

type Props = {
  chats: Chats; // Assume this now includes unreadCount from the server
  userId: string;
};

export const ChatSidebar = ({ chats: initialChats, userId }: Props) => {
  const pathname = usePathname();
  const [chats, setChats] = useState(initialChats);
  const { subscribe } = useAbly();

  // New mutation for marking messages as read
  const markAsReadMutation = useMutation({
    mutationFn: (chatId: string) =>
      fetch("/api/v1/message/read", {
        method: "POST",
        body: JSON.stringify({ chatId }),
      }),
  });

  useEffect(() => {
    const unsubscribe = subscribe(`chat:${userId}`, "message", (message) => {
      setChats((currentChats) => {
        const updatedChats = currentChats.map((chat) =>
          chat.id === message.data.chatId
            ? {
                ...chat,
                messages: [
                  {
                    content: message.data.message,
                    sender: {
                      id: message.data.senderId,
                      displayName: message.data.senderId === userId ? "Du" : message.data.senderDisplayName,
                    },
                    createdAt: new Date(message.timestamp),
                  },
                  ...chat.messages,
                ],
                // Increment unread count if not the active chat and not from current user
                unreadCount:
                  pathname !== `/chat/${message.data.chatId}` && message.data.senderId !== userId
                    ? (chat.unreadCount || 0) + 1
                    : chat.unreadCount,
              }
            : chat
        );

        const updatedChatIndex = updatedChats.findIndex((chat) => chat.id === message.data.chatId);
        if (updatedChatIndex > -1) {
          const [updatedChat] = updatedChats.splice(updatedChatIndex, 1);
          updatedChats.unshift(updatedChat);
        }

        return updatedChats;
      });
    });

    return unsubscribe;
  }, [userId, subscribe, pathname]);

  useEffect(() => {
    const currentChatId = pathname.split("/").pop();
    if (currentChatId && currentChatId.length > 0) {
      const currentChat = chats.find((chat) => chat.id === currentChatId);

      if (currentChat && currentChat.unreadCount > 0) {
        markAsReadMutation.mutate(currentChatId);
        setChats((prev) => prev.map((chat) => (chat.id === currentChatId ? { ...chat, unreadCount: 0 } : chat)));
      }
    }
  }, [pathname, chats]);

  return (
    <aside
      className={cn(
        "w-full md:max-w-96 text-ellipsis overflow-y-auto scrollbar-slim whitespace-pre-wrap break-all flex flex-col p-2 border-r border-secondary",
        pathname.includes("/chat/") ? "max-md:hidden" : "block"
      )}
    >
      {chats.map((chat, index) => (
        <ChatLink
          key={index}
          chat={chat}
          userId={userId}
          unreadCount={chat.unreadCount || 0}
          isActive={pathname === `/chat/${chat.id}`}
        />
      ))}
    </aside>
  );
};

const ChatLink = ({
  chat,
  userId,
  unreadCount,
  isActive,
}: {
  chat: Chats[0];
  userId: string;
  unreadCount: number;
  isActive: boolean;
}) => {
  const getLatestMessageContent = useCallback(() => {
    const lastMessage = chat.messages[0];
    if (!lastMessage) return "No messages yet";
    return `${lastMessage.sender.id === userId ? "Du" : lastMessage.sender.displayName}: ${lastMessage.content}`;
  }, [chat, userId]);

  const getLatestMessageTime = useCallback(() => {
    const timeStamp = chat.messages[0]?.createdAt || chat.createdAt;
    const now = new Date();
    const diffInHours = (now.getTime() - timeStamp.getTime()) / (1000 * 60 * 60);

    if (diffInHours >= 24) {
      return timeStamp.toLocaleDateString("en", { month: "short", day: "numeric" });
    }

    return timeStamp.toLocaleString("en", { hour: "numeric", minute: "numeric", hour12: false });
  }, [chat]);

  return (
    <Link
      href={`/chat/${chat.id}`}
      prefetch={true}
      className={cn(
        "flex items-center gap-2 p-2 hover:bg-secondary rounded-lg transition-colors",
        isActive && "bg-secondary"
      )}
    >
      <Image
        src={chat.listing.ListingImage[0].image.url}
        alt="preview"
        className="object-cover rounded-lg aspect-square"
        width={56}
        height={56}
      />
      <div className="w-full">
        <div className="flex gap-2 justify-between items-center">
          <div className="line-clamp-1">{chat.listing.title}</div>
          <div className="flex-1 text-sm text-right whitespace-nowrap text-primary-light">{getLatestMessageTime()}</div>
        </div>
        <div className="flex gap-2 justify-between items-center">
          <div className="text-primary-light line-clamp-1">{getLatestMessageContent()}</div>
          {unreadCount > 0 && !isActive && (
            <div className="bg-accent text-white text-xs px-3 py-0.5 rounded-full">
              {unreadCount > 10 ? "10+" : unreadCount}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
