import { OverviewQuerySchema } from '@/consts/schema';
import { GetFormatterForCurrency } from '@/lib/helpers';
import { prismaDB } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const searchParams = new URL(request.url).searchParams;
  const fromDate = searchParams.get('from');
  const toDate = searchParams.get('to');
  const page = searchParams.get('page') || 1;

  const validatedData = OverviewQuerySchema.safeParse({
    from: fromDate,
    to: toDate,
    page: page,
  });

  if (!validatedData.success) {
    return Response.json(validatedData.error.message, {
      status: 400,
    });
  }

  const transactionsWithFormattedCurrency = await getTransactionsHistory(
    user.id,
    validatedData.data.from,
    validatedData.data.to,
    validatedData.data.page
  );

  return Response.json(transactionsWithFormattedCurrency);
}

export type TransactionHistoryType = Awaited<
  ReturnType<typeof getTransactionsHistory>
>;

async function getTransactionsHistory(
  userId: string,
  from: Date,
  to: Date,
  page: number = 1
) {
  const userSettings = await prismaDB.userSettings.findUnique({
    where: {
      userId: userId,
    },
  });

  if (!userSettings) {
    throw new Error('User settings not found');
  }
  const formatter = GetFormatterForCurrency(userSettings.currency);

  const totalCount = await prismaDB.transaction.count({
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
  });

  // if (!totalCount) {
  //   throw new Error('No transactions found');
  // }

  const transactionsHistory = await prismaDB.transaction.findMany({
    where: {
      userId: userId,
      date: {
        gte: from, //greater than or equal to
        lte: to, //less than or equal to
      },
    },
    orderBy: {
      date: 'desc',
    },
    skip: (page - 1) * 10,
    take: 10,
  });

  return transactionsHistory.map((data) => {
    return {
      ...data,
      formattedAmount: formatter.format(data.amount),
      allTransactions: totalCount, // Virtual field only in the response
    };
  });
}
