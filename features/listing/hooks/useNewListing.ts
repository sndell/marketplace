import { useMutation } from '@tanstack/react-query';
import { ListingValues, listingSchemaResponse } from '../schema';

export const useNewListing = () => {
  return useMutation({
    mutationFn: async (formData: ListingValues) => {
      const res = await fetch('/api/v1/listing/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create listing');
      const data = await res.json();
      return listingSchemaResponse.parse(data);
    },
  });
};
