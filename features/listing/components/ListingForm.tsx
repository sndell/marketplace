'use client';

import { useForm } from 'react-hook-form';
import { ListingValues, listingSchema } from '../schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, DualMenu, Textarea, MultiplePhotos } from '@/components/form';
// import { DevTool } from '@hookform/devtools';
import { mainCategories, municipalities, regions, subcategories } from '@/features/listing/data';
import { cn } from '@/util/cn';

export const ListingForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    control,
  } = useForm<ListingValues>({
    resolver: zodResolver(listingSchema),
  });

  const onSubmit = (data: ListingValues) => console.log(data);

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
            errors: errors.category?.primary,
            label: 'Huvudkategori',
            placeholder: 'Välj från listan',
            options: mainCategories,
          }}
          second={{
            name: 'category.secondary',
            errors: errors.category?.secondary,
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
            errors: errors.location?.region,
            label: 'Region',
            placeholder: 'Välj från listan',
            options: regions,
          }}
          second={{
            name: 'location.municipality',
            errors: errors.location?.municipality,
            label: 'Kommun',
            placeholder: 'Välj från listan',
            options: municipalities,
          }}
          maxHeight={320}
        />
        <Input
          registration={register('title')}
          errors={errors.title}
          label="Rubrik"
          isRequired
          placeholder="Vad vill du sälja?"
        />
        <Input
          registration={register('price')}
          errors={errors.title}
          label="Pris (kronor)"
          type="number"
          isRequired
          placeholder="Ange önskat pris"
        />
        <MultiplePhotos
          control={control}
          errors={errors.photos}
          isRequired
          label="Bilder"
          maxPhotos={6}
          description="Lägg till upp till 6 bilder på det du säljer. Varje bild får vara max 10 MB."
        />
        <div className="space-y-1">
          <Textarea
            register={register('description')}
            label="Beskrivning"
            placeholder="Beskriv om det du säljer"
            errors={errors.description}
            isRequired
          />
          <div className={cn('text-sm text-right', description.length > 2000 && 'text-error')}>
            {description.length}/2000 tecken
          </div>
        </div>
        <button className="py-2 rounded-full bg-accent text-secondary">Skapa annons</button>
        {/* <DevTool control={control} /> */}
      </form>
    </div>
  );
};
