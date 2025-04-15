import { prismaDB } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const userSettings = await prismaDB.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  const userTransactions = await prismaDB.transaction.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      date: 'desc',
    },
    select: {
      id: true,
      amount: true,
      description: true,
      date: true,
      category: true,
      categoryIcon: true,
      type: true,
    },
    take: 10,
  });

  return Response.json({
    userSettings,
    userTransactions,
  });
}
