import {
  getSignedUrlRequestSchema,
  getSignedUrlResponseSchema,
} from '@/features/image';
import { validateRequest } from '@/lib/auth';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY as string,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY as string,
  },
});

export async function POST(req: Request) {
  try {
    const { user } = await validateRequest();
    if (!user)
      return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const data = await req.json();
    const validation = getSignedUrlRequestSchema.safeParse(data);
    if (!validation.success)
      return Response.json(
        { error: 'invalid-request', message: 'Invalid data' },
        { status: 400 }
      );

    const keys = validation.data.map((extension) => `${uuidv4()}${extension}`);
    const signedUrls = await Promise.all(
      keys.map((Key) =>
        getSignedUrl(
          S3,
          new PutObjectCommand({
            Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
            Key,
          }),
          { expiresIn: 60 }
        )
      )
    );

    const responseData = getSignedUrlResponseSchema.parse({ signedUrls, keys });
    return Response.json(responseData, { status: 201 });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
