import { listingSchema, listingSchemaResponse } from '@/features/listing/schema';
import { validateRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { user } = await validateRequest();
    if (!user) return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const data = await req.json();
    const validation = listingSchema.safeParse(data);
    if (!validation.success)
      return Response.json({ error: 'invalid-request', message: 'Invalid data' }, { status: 400 });

    const listing = await prisma.listing.create({
      data: {
        title: validation.data.title,
        description: validation.data.description,
        price: validation.data.price,
        mainCategory: validation.data.category.primary,
        subcategory: validation.data.category.secondary,
        region: validation.data.location.region,
        municipality: validation.data.location.municipality,
        creatorId: user.id,
      },
    });

    await prisma.listingImage.createMany({
      data: validation.data.images.map((image) => ({
        imageId: image.id,
        listingId: listing.id,
      })),
    });

    const response = listingSchemaResponse.parse({ id: listing.id });
    return Response.json(response, { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
