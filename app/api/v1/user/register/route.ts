import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { lucia } from '@/lib/auth';
import { cookies } from 'next/headers';
import { RegisterRequestSchema } from '@/features/auth/schema';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const validation = RegisterRequestSchema.safeParse(data);

    if (!validation.success)
      return Response.json({ error: 'invalid-request', message: 'Invalid data' }, { status: 400 });

    const userExists = await prisma.user.findUnique({
      where: { email: validation.data.email },
    });

    if (userExists)
      return Response.json(
        {
          error: 'email-already-registered',
          message: 'Email already registered',
        },
        { status: 400 }
      );

    const password = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: validation.data.email,
        password: password,
        displayName: validation.data.displayName,
        photoUrl: `https://ui-avatars.com/api/?name=${validation.data.displayName}&format=png`,
      },
    });

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return Response.json({ message: 'Registration successful' }, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'internal-server-error', message: 'Internal server error' }, { status: 500 });
  }
}
