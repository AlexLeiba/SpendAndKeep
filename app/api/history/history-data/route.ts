import { prismaDB } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function GET() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const periods = await getHistoryPeriods(user.id);

  return Response.json(periods);
}

export type HistoryPeriodType = Awaited<ReturnType<typeof getHistoryPeriods>>;

async function getHistoryPeriods(userId: string) {
  const result = await prismaDB.monthHistory.findMany({
    where: {
      userId: userId,
    },
    select: {
      year: true,
    },
    // distinct: ['year'],
    orderBy: {
      year: 'asc',
    },
  });

  const years = result.map((item) => item.year);
  const uniqueYears = [...new Set(years)];

  if (uniqueYears.length === 0) {
    return [new Date().getFullYear()]; //return current year if no history found
  }

  return uniqueYears;
}
