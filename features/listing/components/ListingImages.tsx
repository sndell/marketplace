'use client';

import { cn } from '@/util/cn';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type ImageType = {
  url: string;
};

type ListingImagesProps = {
  images: ImageType[];
};

const ImageNavigationButton = ({
  direction,
  onClick,
}: {
  direction: 'left' | 'right';
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => (
  <motion.button
    initial={{ opacity: 0, x: direction === 'left' ? '-50%' : '50%', y: '50%' }}
    animate={{ opacity: 1, x: '0' }}
    exit={{ opacity: 0, x: direction === 'left' ? '-50%' : '50%' }}
    transition={{ duration: 0.1 }}
    onClick={onClick}
    className={cn(
      'absolute z-20 grid w-10 border rounded-full shadow-lg border-black/10 bottom-1/2 place-content-center aspect-square bg-black/50',
      direction === 'left' ? 'left-2' : 'right-2'
    )}
  >
    <span
      className={
        direction === 'left'
          ? 'icon-[solar--alt-arrow-left-outline] text-secondary text-2xl'
          : 'icon-[solar--alt-arrow-right-outline] text-secondary text-2xl'
      }
    />
  </motion.button>
);

const ImageCounter = ({ current, total }: { current: number; total: number }) => (
  <motion.div
    initial={{ opacity: 0, y: '50%', x: '-50%' }}
    animate={{ opacity: 1, y: '0' }}
    exit={{ opacity: 0, y: '50%' }}
    transition={{ duration: 0.1 }}
    className="absolute z-20 px-3 py-1 font-light border rounded-full shadow-lg bottom-2 left-1/2 bg-black/50 border-black/10 text-secondary"
  >
    {current + 1}/{total}
  </motion.div>
);

const ThumbnailImage = ({
  image,
  index,
  isSelected,
  isFullscreen,
  onClick,
  onMouseEnter,
}: {
  image: ImageType;
  index: number;
  isSelected: boolean;
  isFullscreen: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}) => (
  <button
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    key={index}
    className={cn(
      'relative overflow-hidden rounded-md w-18 h-18 aspect-square',
      !isFullscreen && 'border border-secondary'
    )}
  >
    <Image src={image.url} height={72} width={72} alt="preview" className="object-cover w-full h-full aspect-square" />
    {isSelected && (
      <>
        <div className={cn('absolute inset-0 rounded-md border-4', isFullscreen ? 'border-black' : 'border-white')} />
        <div className="absolute inset-0 border-2 rounded-md border-accent" />
      </>
    )}
  </button>
);

export const ListingImages = ({ images }: ListingImagesProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isFullscreen]);

  const goToPreviousImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSelectedImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNextImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSelectedImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const selectedImage = images[selectedImageIndex];

  return (
    <div className={cn('flex flex-col space-y-2', isFullscreen && 'fixed h-dvh flex inset-0 flex-col bg-black z-50')}>
      <div
        onClick={() => setIsFullscreen((state) => !state)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'relative overflow-hidden rounded-md flex-1 cursor-pointer',
          !isFullscreen && 'border border-secondary'
        )}
      >
        <AnimatePresence>
          {(isHovered || isFullscreen) && (
            <>
              <ImageNavigationButton direction="left" onClick={goToPreviousImage} />
              <ImageNavigationButton direction="right" onClick={goToNextImage} />
              <ImageCounter current={selectedImageIndex} total={images.length} />
            </>
          )}
        </AnimatePresence>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={selectedImage.url}
          alt="Main photo"
          className={cn('object-contain absolute z-10 w-full h-full', !isFullscreen && 'aspect-[16/10] h-full')}
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={selectedImage.url}
          alt="background photo"
          className={cn(
            'object-cover blur-2xl w-full h-full inset-0 bg-secondaryDark opacity-40',
            !isFullscreen && 'aspect-[16/10]'
          )}
        />
      </div>
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className={cn('flex flex-wrap gap-2 pb-2', isFullscreen ? 'w-full justify-center' : 'w-fit')}>
          {images.map((image, index) => (
            <ThumbnailImage
              key={index}
              image={image}
              index={index}
              isSelected={index === selectedImageIndex}
              isFullscreen={isFullscreen}
              onClick={() => setSelectedImageIndex(index)}
              onMouseEnter={() => setSelectedImageIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
