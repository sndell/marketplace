"use client";

import { cn } from "@/util/cn";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

type ListingImagesProps = {
  images: ImageType[];
  isPreview?: boolean;
};

const ImageNavigationButton = ({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => (
  <motion.button
    initial={{ opacity: 0, x: direction === "left" ? "-50%" : "50%", y: "50%" }}
    animate={{ opacity: 1, x: "0" }}
    exit={{ opacity: 0, x: direction === "left" ? "-50%" : "50%" }}
    transition={{ duration: 0.1 }}
    onClick={onClick}
    className={cn(
      "absolute z-20 grid w-10 border rounded-full shadow-lg border-black/10 bottom-1/2 place-content-center aspect-square bg-black/50",
      direction === "left" ? "left-2" : "right-2"
    )}
  >
    <span
      className={
        direction === "left"
          ? "icon-[solar--alt-arrow-left-outline] text-secondary text-2xl"
          : "icon-[solar--alt-arrow-right-outline] text-secondary text-2xl"
      }
    />
  </motion.button>
);

const ImageCounter = ({ current, total }: { current: number; total: number }) => (
  <motion.div
    initial={{ opacity: 0, y: "50%", x: "-50%" }}
    animate={{ opacity: 1, y: "0" }}
    exit={{ opacity: 0, y: "50%" }}
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
      "relative overflow-hidden rounded-md w-18 h-18 aspect-square",
      !isFullscreen && "border border-secondary"
    )}
  >
    <Image src={image.url} height={72} width={72} alt="preview" className="object-cover w-full h-full aspect-square" />
    {isSelected && (
      <>
        <div className={cn("absolute inset-0 rounded-md border-4", isFullscreen ? "border-black" : "border-white")} />
        <div className="absolute inset-0 border-2 rounded-md border-accent" />
      </>
    )}
  </button>
);

export const ListingImages = ({ images, isPreview = false }: ListingImagesProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? "hidden" : isPreview ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
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

  if (images.length === 0)
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-primary aspect-16/10">
        <div className="icon-[solar--camera-linear] text-primary/80 text-4xl" />
        Inga bilder tillgängliga
      </div>
    );

  return (
    <div className={cn("flex flex-col space-y-2", isFullscreen && "fixed h-dvh flex inset-0 flex-col bg-black z-50")}>
      <div
        onClick={() => setIsFullscreen((state) => !state)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative overflow-hidden rounded-md cursor-pointer",
          !isFullscreen ? "border border-secondary" : "flex-1"
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

        <div
          className={cn(
            "flex transition-transform duration-200 ease-in-out h-full w-full",
            !isFullscreen && "aspect-16/10"
          )}
          style={{ transform: `translateX(-${selectedImageIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full h-full shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt={`Photo ${index + 1}`} className="absolute z-10 object-contain w-full h-full" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={`Background ${index + 1}`}
                className="inset-0 object-cover w-full h-full blur-2xl bg-secondary-dark opacity-40"
              />
            </div>
          ))}
        </div>
      </div>
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className={cn("flex flex-wrap gap-2", isFullscreen ? "w-full justify-center" : "w-fit")}>
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
