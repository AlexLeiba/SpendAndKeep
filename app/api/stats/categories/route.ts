import { OverviewQuerySchema } from '@/consts/schema';
import { prismaDB } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const queryParams = OverviewQuerySchema.safeParse({
    from,
    to,
  });

  if (!queryParams.success) {
    throw new Error(queryParams.error.message);
  }

  const stats = await getCategoriesStats(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );

  return Response.json(stats);
}

export type GetCategoriesStatsType = Awaited<
  ReturnType<typeof getCategoriesStats>
>;

async function getCategoriesStats(userId: string, from: Date, to: Date) {
  const stats = await prismaDB.transaction.groupBy({
    by: ['type', 'category', 'categoryIcon'], //group by (type, category, categoryIcon) presented in (prisma.schema) under the model (transaction) Will concatenate the amoun sum if all fields matches
    // where is used as a filer
    where: {
      userId: userId, //filter by userId
      date: {
        gte: from, //greater than or equal to
        lte: to, //less than or equal to
      },
    },
    // will sum all the values of the amount field ( if its the same date with the same category and type ) the amount will simplty be added with prev one
    _sum: {
      amount: true,
    },
    // will order by the sum of the amount field
    orderBy: {
      _sum: {
        amount: 'desc',
      },
    },
  });

  return stats;
}
