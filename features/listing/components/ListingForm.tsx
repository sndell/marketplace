"use client";

import { useForm } from "react-hook-form";
import { ListingValues, listingSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, DualMenu, Textarea, MultipleImages } from "@/components/form";
// import { DevTool } from '@hookform/devtools';
import { mainCategories, municipalities, regions, subcategories } from "@/features/listing/data/categoriesAndLocations";
import { cn } from "@/util/cn";
import { useNewListing } from "../hooks/useNewListing";
import { useRouter } from "next/navigation";
import { ListingPreview } from "./ListingPreview";
import { useState } from "react";

export const ListingForm = () => {
  const newListing = useNewListing();
  const router = useRouter();
  const [isShowPreview, setIsShowPreview] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    control,
  } = useForm<ListingValues>({
    resolver: zodResolver(listingSchema),
  });

  const onSubmit = async (data: ListingValues) => {
    try {
      const res = await newListing.mutateAsync(data);
      router.push(`/listing/${res.id}`);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const showPreview = () => setIsShowPreview(!isShowPreview);
  const closePreview = () => setIsShowPreview(false);

  const title = watch("title") || "";
  const price = watch("price") || null;
  const description = watch("description") || "";
  const images = watch("images") || [];
  const location = watch("location");

  return (
    <div className="grid px-3 pb-3 mx-auto md:grid-cols-2 lg:grid-cols-5 max-w-7xl xs:py-3">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 lg:col-span-2">
        <DualMenu
          control={control}
          label="Kategori"
          isRequired
          first={{
            name: "category.primary",
            error: errors.category?.primary,
            label: "Huvudkategori",
            placeholder: "Välj från listan",
            options: mainCategories,
          }}
          second={{
            name: "category.secondary",
            error: errors.category?.secondary,
            label: "Underkategori",
            placeholder: "Välj från listan",
            options: subcategories,
          }}
          maxHeight={320}
        />
        <DualMenu
          control={control}
          label="Plats"
          isRequired
          first={{
            name: "location.region",
            error: errors.location?.region,
            label: "Region",
            placeholder: "Välj från listan",
            options: regions,
          }}
          second={{
            name: "location.municipality",
            error: errors.location?.municipality,
            label: "Kommun",
            placeholder: "Välj från listan",
            options: municipalities,
          }}
          maxHeight={320}
        />
        <Input
          registration={register("title")}
          error={errors.title}
          label="Rubrik"
          isRequired
          placeholder="Vad vill du sälja?"
        />
        <Input
          registration={register("price")}
          error={errors.title}
          label="Pris (kronor)"
          type="number"
          isRequired
          placeholder="Ange önskat pris"
        />
        <MultipleImages
          control={control}
          error={errors.images}
          isRequired
          label="Bilder"
          maxImages={6}
          description="Lägg till upp till 6 bilder, max 20MB per bild. Håll in på en bild för att ändra ordning. Första bilden blir omslagsbild."
        />
        <div className="space-y-1">
          <Textarea
            register={register("description")}
            label="Beskrivning"
            placeholder="Beskriv om det du säljer"
            error={errors.description}
            isRequired
          />
          <div className={cn("text-sm text-right", description.length > 2000 && "text-error")}>
            {description.length}/2000 tecken
          </div>
        </div>
        <button
          type="button"
          onClick={showPreview}
          className="h-[42px] flex items-center gap-2 md:hidden justify-center rounded-full bg-primary-dark border border-secondary cursor-pointer"
        >
          {/* <span className="icon-[solar--eye-linear] text-xl" /> */}
          Visa förhandsvisning
        </button>
        <button className="flex justify-center h-[42px] items-center rounded-full bg-accent hover:bg-accent-light transition-colors border border-accent cursor-pointer text-secondary">
          {newListing.isPending ? <span className="icon-[svg-spinners--3-dots-scale] text-3xl" /> : "Skapa annons"}
        </button>
        {/* <DevTool control={control} /> */}
      </form>
      <ListingPreview
        images={images}
        title={title}
        price={price}
        description={description}
        location={location}
        isShowPreview={isShowPreview}
        closePreview={closePreview}
      />
    </div>
  );
};
