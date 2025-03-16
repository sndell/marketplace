import { lucia, validateRequest } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const { session } = await validateRequest();
    if (!session) return Response.json({ error: 'not-logged-in', message: 'You are not logged in' }, { status: 401 });
    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return Response.json({ message: 'Logout successful' }, { status: 200 });
  } catch (error) {
    return Response.json({ error: 'internal-server-error', message: 'Internal server error' }, { status: 500 });
  }
}
