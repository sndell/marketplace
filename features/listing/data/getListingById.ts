'server only';

import { prisma } from '@/lib/prisma';

export const getListingById = async (id: string): Promise<Listing | null> => {
  const listing = await prisma.listing.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      title: true,
      price: true,
      region: true,
      municipality: true,
      mainCategory: true,
      subcategory: true,
      createdAt: true,
      description: true,
      ListingImage: {
        include: {
          image: {
            select: {
              url: true,
            },
          },
        },
      },
      creator: {
        select: {
          displayName: true,
          photoUrl: true,
          createdAt: true,
        },
      },
    },
  });

  if (!listing) return null;

  return {
    id: listing.id,
    title: listing.title,
    price: listing.price,
    region: listing.region,
    municipality: listing.municipality,
    mainCategory: listing.mainCategory,
    subcategory: listing.subcategory,
    createdAt: listing.createdAt,
    images: listing.ListingImage.map((image) => ({
      url: image.image.url,
    })),
    description: listing.description,
    creator: {
      displayName: listing.creator.displayName,
      photoURL: listing.creator.photoUrl,
      memberSince: listing.creator.createdAt.getFullYear().toString(),
    },
  };
};
