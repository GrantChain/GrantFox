import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId, user, grantProvider, grantee } = body;

    if (!userId || !user) {
      return NextResponse.json(
        { error: 'Missing userId or user data' },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: { user_id: userId },
      data: {
        ...user,
        updated_at: new Date(),
      },
    });

    if (grantProvider) {
      await prisma.grant_provider.upsert({
        where: { user_id: userId },
        create: { user_id: userId, ...grantProvider },
        update: { ...grantProvider, updated_at: new Date() },
      });
    }

    if (grantee) {
      await prisma.grantee.upsert({
        where: { user_id: userId },
        create: { user_id: userId, ...grantee },
        update: { ...grantee, updated_at: new Date() },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
