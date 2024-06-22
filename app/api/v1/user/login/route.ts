import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { lucia } from '@/lib/auth';
import { cookies } from 'next/headers';
import { LoginFormSchema } from '@/features/auth/schema';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const validation = LoginFormSchema.safeParse(data);
    if (!validation.success)
      return Response.json({ error: 'invalid-request', message: 'Invalid data' }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { email: validation.data.email.toLowerCase() },
    });

    if (!user)
      return Response.json(
        {
          error: 'email-not-found',
          message: 'Invalid email',
        },
        { status: 401 }
      );
    const match = await bcrypt.compare(validation.data.password, user.password);
    if (!match)
      return Response.json(
        {
          error: 'incorrect-password',
          message: 'Wrong password',
        },
        { status: 401 }
      );

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return Response.json({ message: 'Login successful' }, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'internal-server-error', message: 'Internal server error' }, { status: 500 });
  }
}
