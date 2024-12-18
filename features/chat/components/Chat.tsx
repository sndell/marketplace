"use client";

import { getMunicipalityLabelByValue, getRegionLabelByValue } from "@/features/listing/util/getLabelByValue";
import { useAbly } from "@/providers/AblyContext";
import { cn } from "@/util/cn";
import { useMutation } from "@tanstack/react-query";
import { User } from "lucia";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Message = {
  senderId: string;
  message: string;
  createdAt: Date;
};

type Props = {
  messages: Message[];
  user: User;
  otherUser: ChatUser;
  listing: ChatListing;
};

export const Chat = ({ messages: serverMessages, user, otherUser, listing }: Props) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const { chatId } = useParams<{ chatId: string }>();
  const [messages, setMessages] = useState<Message[]>(serverMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { subscribe } = useAbly();
  const isInitialLoadRef = useRef(true);

  const mutation = useMutation({
    mutationFn: (message: string) =>
      fetch("/api/v1/message/new", {
        method: "POST",
        body: JSON.stringify({ message, chatId: chatId, recipientId: otherUser.id }),
      }),
  });

  useEffect(() => {
    const unsubscribe = subscribe(`chat:${user.id}`, "message", (message) => {
      if (message.data.chatId === chatId) {
        setMessages((prevMessages) => [...prevMessages, { ...message.data, createdAt: new Date(message.timestamp) }]);
      }
    });

    return () => unsubscribe();
  }, [chatId, user.id, subscribe]);

  useEffect(() => {
    if (isInitialLoadRef.current && bottomRef.current) {
      bottomRef.current.scrollIntoView();
      isInitialLoadRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!isInitialLoadRef.current && bottomRef.current && chatContainerRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = chatContainerRef.current;
      const isScrolledToBottom = scrollHeight - clientHeight <= scrollTop + 100;

      if (isScrolledToBottom) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || mutation.isPending) return;
    mutation.mutate(currentMessage);
    setCurrentMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const router = useRouter();

  return (
    <div className="flex overflow-hidden flex-col w-full h-full border-r border-secondary max-md:absolute max-md:inset-0 max-md:z-50 max-md:bg-white">
      <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-center p-2 border-b border-secondary">
        <Image
          src={otherUser.photoUrl}
          width={40}
          height={40}
          alt="other user"
          className="rounded-full aspect-square"
        />
        <div className="flex flex-col">
          <div className="text-sm text-primary">{otherUser.displayName}</div>
          <div className="text-xs text-primaryLight">
            Medlem sedan:{" "}
            {otherUser.createdAt.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}
          </div>
        </div>
        <Link href="/chat" className="grid place-content-center h-full rounded-md bg-secondary aspect-square md:hidden">
          <span className="icon-[clarity--close-line] text-2xl"></span>
        </Link>
      </div>
      <div className="flex justify-between items-center p-2 border-b border-secondary">
        <div className="flex overflow-hidden items-center space-x-2">
          <Image
            src={listing?.ListingImage[0]?.image.url || "/placeholder.jpg"}
            alt={listing?.title || "Listing image"}
            width={64}
            height={64}
            className="object-cover rounded-md aspect-square"
          />
          <div>
            <h2 className="font-semibold line-clamp-2">{listing?.title}</h2>
            <div className="flex gap-1">
              <p className="text-sm text-primaryLight">{getRegionLabelByValue(listing?.region)},</p>
              <p className="text-sm text-primaryLight">{getMunicipalityLabelByValue(listing?.municipality)}</p>
            </div>
          </div>
        </div>
        <p className="flex-1 font-bold text-right whitespace-nowrap text-primary">
          {listing?.price ? `${listing.price} kr` : "Pris ej angivet"}
        </p>
      </div>

      <div ref={chatContainerRef} className="flex overflow-y-auto flex-col gap-2 p-2 h-full">
        {messages.map((message, index) => (
          <div key={index} className="space-y-1">
            <div className={cn("text-xs text-primaryLight", message.senderId === user?.id && "text-end")}>
              {message.createdAt.toLocaleDateString("en", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
              <div
                className={cn(
                  "px-2 py-2 rounded-2xl w-fit text-base break-words max-w-[80%]",
                  message.senderId === user?.id
                    ? "ml-auto bg-accent text-secondary rounded-br-none"
                    : "bg-secondary rounded-bl-none"
                )}
              >
                {message.message}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2 p-2 border-t border-secondary">
        <input
          type="text"
          value={currentMessage}
          placeholder="Type a message..."
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 px-2 rounded-lg border appearance-none outline-none bg-secondary border-secondary"
        />
        <button
          onClick={handleSendMessage}
          disabled={!currentMessage.trim() || mutation.isPending}
          className="flex items-center px-2 h-10 rounded-lg bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="icon-[solar--plain-2-bold-duotone] text-secondary text-2xl h-full" />
        </button>
      </div>
    </div>
  );
};
