'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

type Props = {
  listingId: string;
};

export const MessageButton = ({ listingId }: Props) => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (listingId: string) =>
      fetch('/api/v1/chat/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listingId }),
      }).then((res) => res.json()),
    onSuccess(data) {
      router.push(data);
    },
  });

  return (
    <button
      onClick={() => mutation.mutate(listingId)}
      className="flex items-center justify-center w-full gap-4 py-3 text-white bg-accent rounded-xl"
    >
      <span className="icon-[solar--chat-line-outline] text-2xl" />
      Skicka ett meddelande
    </button>
  );
};