'use client';

import { useForm } from 'react-hook-form';
import { ListingValues, listingSchema } from '../schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, DualMenu, Textarea, MultipleImages } from '@/components/form';
// import { DevTool } from '@hookform/devtools';
import { mainCategories, municipalities, regions, subcategories } from '@/features/listing/data';
import { cn } from '@/util/cn';
import { useNewListing } from '../hooks/useNewListing';

export const ListingForm = () => {
  const newListing = useNewListing();
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
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const description = watch('description') || '';

  return (
    <div className="grid px-3 pb-3 mx-auto md:grid-cols-2 lg:grid-cols-3 max-w-7xl xs:py-3">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <DualMenu
          control={control}
          label="Kategori"
          isRequired
          first={{
            name: 'category.primary',
            error: errors.category?.primary,
            label: 'Huvudkategori',
            placeholder: 'Välj från listan',
            options: mainCategories,
          }}
          second={{
            name: 'category.secondary',
            error: errors.category?.secondary,
            label: 'Underkategori',
            placeholder: 'Välj från listan',
            options: subcategories,
          }}
          maxHeight={320}
        />
        <DualMenu
          control={control}
          label="Plats"
          isRequired
          first={{
            name: 'location.region',
            error: errors.location?.region,
            label: 'Region',
            placeholder: 'Välj från listan',
            options: regions,
          }}
          second={{
            name: 'location.municipality',
            error: errors.location?.municipality,
            label: 'Kommun',
            placeholder: 'Välj från listan',
            options: municipalities,
          }}
          maxHeight={320}
        />
        <Input
          registration={register('title')}
          error={errors.title}
          label="Rubrik"
          isRequired
          placeholder="Vad vill du sälja?"
        />
        <Input
          registration={register('price')}
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
            register={register('description')}
            label="Beskrivning"
            placeholder="Beskriv om det du säljer"
            error={errors.description}
            isRequired
          />
          <div className={cn('text-sm text-right', description.length > 2000 && 'text-error')}>
            {description.length}/2000 tecken
          </div>
        </div>
        <button className="flex justify-center h-[42px] items-center rounded-full bg-accent text-secondary">
          {newListing.isPending ? <span className="icon-[svg-spinners--3-dots-scale] text-3xl" /> : 'Skapa annons'}
        </button>
        {/* <DevTool control={control} /> */}
      </form>
    </div>
  );
};
