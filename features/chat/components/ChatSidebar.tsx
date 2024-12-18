"use client";

import { cn } from "@/util/cn";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAbly } from "@/providers/AblyContext";
import { formatDistanceToNowStrict } from "date-fns";

type Props = {
  chats: Chats;
  userId: string;
};

interface UnreadMessages {
  [chatId: string]: number;
}

export const ChatSidebar = ({ chats: initialChats, userId }: Props) => {
  const pathname = usePathname();
  const [chats, setChats] = useState(initialChats);
  const [unreadMessages, setUnreadMessages] = useState<UnreadMessages>({});
  const { subscribe } = useAbly();

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

      // Increment unread count if message is not from current user and chat is not active
      if (message.data.senderId !== userId && pathname !== `/chat/${message.data.chatId}`) {
        setUnreadMessages((prev) => ({
          ...prev,
          [message.data.chatId]: (prev[message.data.chatId] || 0) + 1,
        }));
      }
    });

    return unsubscribe;
  }, [userId, subscribe, pathname]);

  useEffect(() => {
    const currentChatId = pathname.split("/").pop();
    if (currentChatId && unreadMessages[currentChatId]) {
      setUnreadMessages((prev) => ({
        ...prev,
        [currentChatId]: 0,
      }));
    }
  }, [pathname]);

  const getLatestMessageContent = (chat: Chats[0]) => {
    const lastMessage = chat.messages[0];
    if (!lastMessage) return "No messages yet";
    return `${lastMessage.sender.id === userId ? "Du" : lastMessage.sender.displayName}: ${lastMessage.content}`;
  };

  const getLatestMessageTime = (chat: Chats[0]) => {
    const lastMessage = chat.messages[0];
    if (!lastMessage) return "No message";
    const distance = formatDistanceToNowStrict(lastMessage.createdAt);
    if (Number(distance) > 24 * 60 * 60 * 1000) {
      return lastMessage.createdAt.toLocaleDateString("en", {
        month: "short",
        day: "numeric",
      });
    }
    return lastMessage.createdAt.toLocaleString("en", {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });
  };

  return (
    <aside
      className={cn(
        "w-full md:max-w-96 overflow-ellipsis overflow-y-auto whitespace-pre-wrap break-all flex flex-col p-2 border-r border-secondary",
        pathname.includes("/chat/") ? "max-md:hidden" : "block"
      )}
    >
      {chats.map((chat, index) => (
        <Link
          key={index}
          href={`/chat/${chat.id}`}
          className={cn(
            "flex items-center gap-2 p-2 hover:bg-secondary rounded-lg transition-colors",
            pathname === `/chat/${chat.id}` && "bg-secondary"
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
              <div className="flex-1 text-sm text-right whitespace-nowrap text-primaryLight">
                {getLatestMessageTime(chat)}
              </div>
            </div>
            <div className="flex gap-2 justify-between items-center">
              <div className="text-primaryLight line-clamp-1">{getLatestMessageContent(chat)}</div>
              {unreadMessages[chat.id] > 0 && pathname !== `/chat/${chat.id}` && (
                <div className="bg-accent text-white text-xs px-3 py-0.5  rounded-full">{unreadMessages[chat.id]}</div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </aside>
  );
};
