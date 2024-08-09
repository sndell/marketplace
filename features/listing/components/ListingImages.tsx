'use client';

import { cn } from '@/util/cn';
import Image from 'next/image';
import { useState } from 'react';

type Props = {
  images: {
    url: string;
  }[];
};

export const ListingImages = ({ images }: Props) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="space-y-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[selectedImageIndex].url}
        alt="Main photo"
        className="object-contain w-full border aspect-[16/12] bg-secondary border-primary rounded-xl"
      />
      {images.length > 1 && (
        <div className="grid grid-cols-6 gap-2 border-secondary pb-2 border-b">
          {images.map((image, index) => (
            <button
              onClick={() => setSelectedImageIndex(index)}
              key={index}
              className="relative overflow-hidden border rounded-md border-secondary aspect-square"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt="preview" className="object-cover aspect-square h=-full w-full" />
              {index === selectedImageIndex && <div className="absolute inset-0 bg-secondary/50" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
