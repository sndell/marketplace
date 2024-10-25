import { newImageRequestSchema, newImageResponseSchema } from '@/features/image';
import { validateRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { user } = await validateRequest();
    if (!user) return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const data = await req.json();
    const validation = newImageRequestSchema.safeParse(data);
    if (!validation.success)
      return Response.json({ error: 'invalid-request', message: 'Invalid data' }, { status: 400 });

    const uploadedData = await prisma.image.createManyAndReturn({
      data: [
        ...validation.data.map((key) => ({
          url: `${process.env.CLOUDFLARE_PUBLIC_URL}/${process.env.CLOUDFLARE_BUCKET_NAME}/${key}`,
          creatorId: user.id,
        })),
      ],
    });

    const images = uploadedData.map((image) => ({
      url: image.url,
      id: image.id,
    }));

    const response = newImageResponseSchema.parse(images);
    return Response.json(response, { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
