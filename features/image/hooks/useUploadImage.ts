'use client';

import { useMutation } from '@tanstack/react-query';
import { getSignedUrlResponseSchema, newImageResponseSchema } from '../schema';
import { useState } from 'react';

export const useUploadImages = () => {
  const [isUploading, setIsUploading] = useState(false);

  const getSignedUrls = useMutation({
    mutationFn: async (extensions: string[]) => {
      const res = await fetch('/api/v1/image/signed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(extensions),
      });

      if (!res.ok) throw new Error('Failed to get signed URLs');
      const data = await res.json();
      return getSignedUrlResponseSchema.parse(data);
    },
  });

  const createImage = useMutation({
    mutationFn: async (keys: string[]) => {
      const res = await fetch('/api/v1/image/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(keys),
      });

      if (!res.ok) throw new Error('Failed to create image');
      const data = await res.json();
      return newImageResponseSchema.parse(data);
    },
  });

  const uploadImages = async (files: File[], keys: string[]) => {
    try {
      setIsUploading(true);
      const data = await getSignedUrls.mutateAsync(keys);
      await Promise.all(
        files.map((file, index) =>
          fetch(data.signedUrls[index], {
            method: 'PUT',
            body: file,
            mode: 'cors',
          }).then((res) => {
            if (!res.ok) throw new Error(`Failed to upload file ${file.name}`);
          })
        )
      );

      return await createImage.mutateAsync(data.keys);
    } catch (error) {
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImages, isUploading };
};
