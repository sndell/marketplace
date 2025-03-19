"use client";

import { getPriceString } from "@/util/getPriceString";
import { ListingImages } from "./ListingImages";
import { MessageButton } from "@/features/chat";
import { getMunicipalityLabelByValue, getRegionLabelByValue } from "../util/getLabelByValue";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import Image from "next/image";
import { useEffect } from "react";
import { cn } from "@/util/cn";

type Props = {
  images: ImageType[];
  title: string;
  price: number | null;
  description: string;
  location: {
    region: string;
    municipality: string;
  } | null;
  isShowPreview: boolean;
  closePreview: () => void;
};

export const ListingPreview = ({
  images,
  title,
  price,
  description,
  location,
  isShowPreview = false,
  closePreview,
}: Props) => {
  const { data: user } = useCurrentUser();

  const formattedTitle = title || "Rubrik saknas";
  const formattedPrice = price ? getPriceString(price) : "Pris saknas";
  const formattedDescription = description || "Beskrivning saknas";
  const regionLabel = location?.region ? getRegionLabelByValue(location.region) : "Region saknas";
  const municipalityLabel = location?.municipality
    ? getMunicipalityLabelByValue(location.municipality)
    : "Kommun saknas";

  useEffect(() => {
    document.body.style.overflow = isShowPreview ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isShowPreview]);

  return (
    <div
      className={cn(
        "relative md:ml-3 max-md:flex max-md:flex-col max-md:divide-y divide-secondary border-secondary lg:col-span-3 max-md:fixed max-md:inset-0  max-md:bg-background z-50 max-md:h-dvh",
        !isShowPreview && "max-md:hidden"
      )}
    >
      <div className="w-full space-y-4 overflow-y-auto md:sticky top-3 max-md:flex-1 max-md:p-3">
        <ListingImages images={images} isPreview={true} />
        {/* Title */}
        <h1 className="pt-2 text-3xl break-all hitespace-pre-wrap">{formattedTitle}</h1>

        {/* Price */}
        <div>
          <div>Pris</div>
          <div className="text-2xl font-bold">{formattedPrice}</div>
        </div>

        {/* Message Button */}
        <MessageButton />

        {/* Divider */}
        <div className="w-full h-[1px] bg-secondary-dark" />

        {/* Description */}
        <div className="break-all whitespace-pre-wrap text-primary-light">{formattedDescription}</div>

        {/* Location */}
        <span className="flex items-center gap-1 pt-1 text-accent">
          <span className="icon-[solar--point-on-map-linear] text-xl" />
          {regionLabel}, {municipalityLabel}
        </span>

        {/* Divider */}
        <div className="w-full h-[1px] bg-secondary-dark" />

        {/* Creator Profile */}
        {user && (
          <div className="flex gap-2">
            <Image src={user.photoUrl} width={54} height={56} alt="Profile photo" className="rounded-full" />
            <div className="flex flex-col justify-center">
              <div className="flex gap-2">
                <span>{user.displayName}</span>
              </div>
              <span className="text-sm text-primary-light">
                Medlem sedan {new Date(user.createdAt).getFullYear().toString()}
              </span>
            </div>
          </div>
        )}
      </div>
      <button
        className="md:hidden h-[42px] bg-primary-dark m-3 rounded-full border border-secondary cursor-pointer"
        onClick={closePreview}
      >
        Stäng förhandsvisning
      </button>
    </div>
  );
};
