import { z } from "zod";

export const newMessageRequestSchema = z.object({
  message: z.string().min(1, { message: "Meddelande krävs" }),
  chatId: z.string().min(1, { message: "Chat id krävs" }),
  recipientId: z.string().min(1, { message: "Recipient id krävs" }),
});

export const newChatRequestSchema = z.object({
  listingId: z.string().min(1, { message: "Listing id krävs" }),
});

export const readChatRequestSchema = z.object({
  chatId: z.string().min(1, { message: "Chat id krävs" }),
});
