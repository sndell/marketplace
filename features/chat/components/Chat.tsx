"use client";

import { useAbly } from "@/providers/AblyContext";
import { cn } from "@/util/cn";
import { useMutation } from "@tanstack/react-query";
import { User } from "lucia";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChatSkeleton } from "./ChatSkeleton";

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
  const [isLoaded, setIsLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { subscribe } = useAbly();

  const newMessageMutation = useMutation({
    mutationFn: (message: string) =>
      fetch("/api/v1/message/new", {
        method: "POST",
        body: JSON.stringify({ message, chatId: chatId, recipientId: otherUser.id }),
      }),
  });

  const markAsReadMutation = useMutation({
    mutationFn: () =>
      fetch("/api/v1/message/read", {
        method: "POST",
        body: JSON.stringify({ chatId }),
      }),
  });

  useEffect(() => {
    if (chatId) {
      markAsReadMutation.mutate();
    }
  }, [chatId]);

  useEffect(() => {
    const unsubscribe = subscribe(`chat:${user.id}`, "message", (message) => {
      if (message.data.chatId === chatId) {
        setMessages((prev) => [...prev, { ...message.data, createdAt: new Date(message.timestamp) }]);
      }

      if (message.data.senderId !== user.id) {
        markAsReadMutation.mutate();
      }
    });

    return () => unsubscribe();
  }, [chatId, user.id, subscribe]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: isLoaded ? "smooth" : "auto" });
      if (!isLoaded) setIsLoaded(true);
    }
  }, [messages, isLoaded]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || newMessageMutation.isPending) return;
    newMessageMutation.mutate(currentMessage);
    setCurrentMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {!isLoaded && <ChatSkeleton />}
      <div
        className={cn(
          "flex overflow-hidden relative flex-col w-full h-full max-md:absolute max-md:inset-0 max-md:h-dvh max-md:overflow-hidden max-md:z-50 max-md:bg-white",
          !isLoaded && "invisible w-0"
        )}
      >
        <div
          ref={chatContainerRef}
          className="flex flex-col h-full gap-2 p-2 pt-20 overflow-y-auto scrollbar-slim pb-18"
        >
          <ChatHeader otherUser={otherUser} />
          <MessageList messages={messages} user={user} />
          <div ref={bottomRef} />
          <MessageInput
            handleSendMessage={handleSendMessage}
            handleKeyPress={handleKeyPress}
            currentMessage={currentMessage}
            setCurrentMessage={setCurrentMessage}
          />
        </div>
      </div>
    </>
  );
};

const ChatHeader = ({ otherUser }: { otherUser: ChatUser }) => (
  <div className="absolute top-0 right-0 left-0 grid grid-cols-[1fr_auto] gap-2 mx-2 pt-2 bg-linear-to-b md:from-white to-100%">
    <div className="flex items-center flex-1 gap-2 p-2 rounded-full backdrop-blur-xs bg-primary/90">
      <Image src={otherUser.photoUrl} width={44} height={44} alt="other user" className="rounded-full aspect-square" />
      <div className="flex flex-col">
        <div className="text-primary">{otherUser.displayName}</div>
        <div className="text-sm text-primary-light">
          Medlem sedan:{" "}
          {otherUser.createdAt.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}
        </div>
      </div>
    </div>
    <Link
      href="/chat"
      className="grid h-full rounded-full place-content-center backdrop-blur-xl bg-background/50 aspect-square md:hidden"
    >
      <span className="icon-[clarity--close-line] text-4xl" />
    </Link>
  </div>
);

const MessageList = ({ messages, user }: { messages: Message[]; user: User }) => (
  <>
    {messages.map((message, index) => (
      <div key={index} className="space-y-1">
        <div className={cn("text-xs text-primary-lighter", message.senderId === user?.id && "text-end")}>
          {message.createdAt.toLocaleDateString("en", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
          <div
            className={cn(
              "px-2 py-2 rounded-2xl w-fit text-base break-words max-w-[80%] text-primary-light",
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
  </>
);

const MessageInput = ({
  handleSendMessage,
  handleKeyPress,
  currentMessage,
  setCurrentMessage,
}: {
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
}) => (
  <div className="flex absolute right-0 bottom-0 left-0 gap-2 p-3 max-md:backdrop-blur-md max-md:bg-primary/90 bg-linear-to-t md:from-white to-90%">
    <input
      type="text"
      value={currentMessage}
      placeholder="Type a message..."
      onChange={(e) => setCurrentMessage(e.target.value)}
      onKeyDown={handleKeyPress}
      className="flex-1 px-4 py-3 rounded-full appearance-none outline-hidden md:border md:border-secondary bg-background"
    />
    <button
      onClick={handleSendMessage}
      disabled={!currentMessage.trim()}
      className="flex items-center justify-center h-12 px-2 rounded-full backdrop-blur-md aspect-square bg-accent disabled:bg-accent/50 disabled:cursor-not-allowed"
    >
      <span className="icon-[solar--plain-outline] text-secondary text-2xl h-full" />
    </button>
  </div>
);
