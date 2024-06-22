import { validateRequest } from '@/lib/auth';

export async function GET() {
  try {
    const { user } = await validateRequest();
    return Response.json(user, { status: 200 });
  } catch (error) {
    return Response.json({ error: 'internal-server-error', message: 'Internal server error' }, { status: 500 });
  }
}
