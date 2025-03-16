import { z } from 'zod';

export const getSignedUrlRequestSchema = z
  .array(z.string().min(1, { message: 'Extension is required' }))
  .min(1, { message: 'At least one key is required' });

export const getSignedUrlResponseSchema = z.object({
  signedUrls: z.array(z.string()),
  keys: z.array(z.string()),
});

export const newImageRequestSchema = z
  .array(z.string().min(1, { message: 'Key is required' }))
  .min(1, { message: 'At least one key is required' });

export const newImageResponseSchema = z.array(
  z.object({
    url: z.string(),
    id: z.string(),
  })
);
