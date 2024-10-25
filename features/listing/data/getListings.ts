'server only';

import { prisma } from '@/lib/prisma';

export const getListings = async () => {
  const data = await prisma.listing.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      region: true,
      municipality: true,
      subcategory: true,
      ListingImage: {
        include: {
          image: {
            select: {
              url: true,
            },
          },
        },
      },
    },
  });

  const listings: Listings = data.map((listing) => ({
    id: listing.id,
    title: listing.title,
    price: listing.price,
    region: listing.region,
    municipality: listing.municipality,
    images: listing.ListingImage.map((image) => ({
      url: image.image.url,
    })),
    subcategory: listing.subcategory,
  }));

  if (!listings || listings.length === 0) return null;
  return listings;
};
