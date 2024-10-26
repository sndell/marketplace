'use client';

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
      <div className="relative overflow-hidden border rounded-md border-secondary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[selectedImageIndex].url}
          alt="Main photo"
          className="object-contain absolute z-10 w-full  aspect-[16/10] "
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[selectedImageIndex].url}
          alt="backkground photo"
          className="object-cover blur-2xl w-full aspect-[16/10] inset-0 bg-secondaryDark opacity-40"
        />
      </div>
      {images.length > 1 && (
        <div className="flex flex-wrap gap-2 pb-2 w-fit">
          {images.map((image, index) => (
            <button
              onClick={() => setSelectedImageIndex(index)}
              onMouseEnter={() => setSelectedImageIndex(index)}
              key={index}
              className="relative overflow-hidden border rounded-md w-18 h-18 border-secondary aspect-square"
            >
              <Image
                src={image.url}
                height={72}
                width={72}
                alt="preview"
                className="object-cover w-full h-full aspect-square"
              />
              {index === selectedImageIndex && <div className="absolute inset-0 border-4 border-white rounded-md" />}
              {index === selectedImageIndex && <div className="absolute inset-0 border-2 rounded-md border-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
