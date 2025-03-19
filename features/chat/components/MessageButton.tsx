"use client";

import { cn } from "@/util/cn";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type Props = { listingId?: string };

export const MessageButton = ({ listingId }: Props) => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch("/api/v1/chat/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: id }),
      });
      if (!response.ok) throw new Error("Failed to create chat");
      return response.json();
    },
    onSuccess: (data) => router.push(data),
  });

  return (
    <button
      onClick={() => mutation.mutate(listingId ?? "")}
      className={cn(
        "flex items-center justify-center w-full gap-4 py-3 text-white bg-accent rounded-xl",
        !listingId && "opacity-50 cursor-not-allowed"
      )}
      disabled={!listingId}
    >
      {mutation.isPending ? (
        <span className="icon-[svg-spinners--3-dots-scale] text-2xl" />
      ) : (
        <>
          <span className="icon-[solar--chat-line-outline] text-2xl" />
          Skicka ett meddelande
        </>
      )}
    </button>
  );
};
