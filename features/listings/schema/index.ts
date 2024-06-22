import { z } from 'zod';

export const newListingSchema = z.object({
  location: z.object({
    region: z.string().min(1, 'Region krävs'),
    municipality: z.string().min(1, 'Kommun krävs'),
  }),
  photos: z.array(z.string()).min(1, { message: 'Lägg till minst 1 bild' }).max(6, { message: 'Max 6 bilder' }),
  category: z.object({
    primary: z.string({ required_error: 'Huvudkategori krävs' }).min(1, 'Huvudkategori krävs'),
    secondary: z.string({ required_error: 'Underkategori krävs' }).min(1, 'Underkategori krävs'),
  }),
  price: z.coerce
    .number({ required_error: 'Pris krävs' })
    .min(1, { message: 'Priset är för lågt' })
    .max(99999999, { message: 'Priset är för högt' }),
  title: z.string().min(1, { message: 'Titel krävs' }).max(100, { message: 'Titeln är för lång' }),
  description: z.string().min(1, { message: 'Beskriving krävs' }).max(2000, { message: 'Beskrivningen är för lång' }),
});

export const listingFilterValidator = z.object({
  region: z.string().optional(),
  category: z.string().optional(),
});

export type ListingFilterValues = z.infer<typeof listingFilterValidator>;
export type NewListingValues = z.infer<typeof newListingSchema>;
