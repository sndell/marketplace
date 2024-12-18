"use client";

import { getMunicipalityLabelByValue, getRegionLabelByValue } from "@/features/listing/util/getLabelByValue";
import { useAbly } from "@/providers/AblyContext";
import { cn } from "@/util/cn";
import { useMutation } from "@tanstack/react-query";
import { User } from "lucia";
import Image from "next/image";
import { useParams } from "next/navigation";
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

  return (
    <div className="w-full h-full flex flex-col overflow-hidden border-r border-secondary  max-md:absolute max-md:inset-0 max-md:z-50 max-md:bg-white">
      <div className="border-b border-secondary p-2 flex gap-2 items-center">
        <Image
          src={otherUser.photoUrl}
          width={40}
          height={40}
          alt="other user"
          className="rounded-full aspect-square"
        />
        <div className="flex flex-col">
          <div className="text-primary text-sm">{otherUser.displayName}</div>
          <div className="text-primaryLight text-xs">
            Medlem sedan:{" "}
            {otherUser.createdAt.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between p-2 border-b border-secondary">
        <div className="flex items-center space-x-2 overflow-hidden">
          <Image
            src={listing?.ListingImage[0]?.image.url || "/placeholder.jpg"}
            alt={listing?.title || "Listing image"}
            width={64}
            height={64}
            className="rounded-md object-cover aspect-square"
          />
          <div>
            <h2 className="font-semibold line-clamp-2">{listing?.title}</h2>
            <div className="flex gap-1">
              <p className="text-sm text-primaryLight">{getRegionLabelByValue(listing?.region)},</p>
              <p className="text-sm text-primaryLight">{getMunicipalityLabelByValue(listing?.municipality)}</p>
            </div>
          </div>
        </div>
        <p className="font-bold text-primary whitespace-nowrap flex-1 text-right">
          {listing?.price ? `${listing.price} kr` : "Pris ej angivet"}
        </p>
      </div>

      <div ref={chatContainerRef} className="h-full overflow-y-auto flex flex-col gap-2 p-2">
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
      <div className="flex p-2 gap-2 border-t border-secondary">
        <input
          type="text"
          value={currentMessage}
          placeholder="Type a message..."
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 appearance-none bg-secondary border border-secondary rounded-lg px-2 outline-none"
        />
        <button
          onClick={handleSendMessage}
          disabled={!currentMessage.trim() || mutation.isPending}
          className="bg-accent px-2 flex items-center rounded-lg h-10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="icon-[solar--plain-2-bold-duotone] text-secondary text-2xl h-full" />
        </button>
      </div>
    </div>
  );
};
