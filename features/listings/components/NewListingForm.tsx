'use client';

import { useForm } from 'react-hook-form';
import { NewListingValues, newListingSchema } from '../schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, DualMenu, Textarea } from '@/components/form';
import { mainCategories, subcategories } from '@/features/listings/data';
import { cn } from '@/util/cn';

export const NewListingForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    control,
  } = useForm<NewListingValues>({ resolver: zodResolver(newListingSchema) });

  const onSubmit = (data: NewListingValues) => console.log(data);

  const description = watch('description') || '';

  return (
    <div className="grid px-3 mx-auto md:grid-cols-2 lg:grid-cols-3 max-w-7xl xs:py-3">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
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
        />
        <div className="space-y-1">
          <Textarea
            register={register('description')}
            label="Beskrivning"
            placeholder="Beskriv om det du säljer"
            errors={errors.description}
            isRequired
          />
          <div className={cn('text-xs text-right', description.length > 2000 && 'text-error')}>
            {description.length}/2000 tecken
          </div>
        </div>
        <button>Submit</button>
      </form>
    </div>
  );
};
