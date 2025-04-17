import { GetHistoryDataSchema } from '@/consts/schema';
import { prismaDB } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { getDaysInMonth } from 'date-fns';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  //GET QUERY PARAMS
  const searchParams = new URL(request.url).searchParams;

  const timeframeParam = searchParams.get('timeframe');
  const monthParam = searchParams.get('month');
  const yearParam = searchParams.get('year');

  // VALIDATE QUERY PARAMS WITH ZOD SCHEMA
  const queryParamsParsed = GetHistoryDataSchema.safeParse({
    timeframe: timeframeParam,
    month: monthParam,
    year: yearParam,
  });

  if (!queryParamsParsed.success) {
    return Response.json(queryParamsParsed.error.message, {
      status: 400,
    });
  }

  const { timeframe, month, year } = queryParamsParsed.data;

  const data = await getHistoryData(user.id, timeframe, month, year);

  return Response.json(data);
}

export type HistoryDataType = Awaited<ReturnType<typeof getHistoryData>>;

async function getHistoryData(
  userId: string,
  timeframe: 'month' | 'year',
  month: number,
  year: number
) {
  switch (timeframe) {
    case 'month':
      return await getMonthHistoryData(userId, month, year);

    case 'year':
      return await getYearHistoryData(userId, year);

    default:
      return await getYearHistoryData(userId, year);
  }
}

async function getMonthHistoryData(
  userId: string,
  month: number,
  year: number
) {
  const result = await prismaDB.monthHistory.groupBy({
    by: ['day'], //loop through all days in the month
    where: {
      userId: userId,
      month: month,
      year: year,
    },
    _sum: {
      income: true, //sum all income
      expense: true, //sum all expense
    },
    orderBy: {
      day: 'asc',
    },
  });

  if (!result || result.length === 0) {
    return [];
  }

  // [
  //   {
  //     month:0 january
  //     income:400
  //     expense:200
  //     year: 2023
  //     ->  lets add the missing months except the months already exists / the same with days
  //   }
  // ]

  const history: HistoryFilteredType[] = [];
  // Loop through all months to add missing months in our response
  const daysInMonth = getDaysInMonth(new Date(year, month)); //get the number of days in the month

  for (let index = 0; index < daysInMonth; index++) {
    let expense = 0;
    let income = 0;

    const day = result.find((data) => data.day === index); //find the day in the result
    if (day) {
      expense = day._sum.expense || 0;
      income = day._sum.income || 0;
    }

    history.push({
      //the rest of the days which werent found in (response) will be added with (expense/income = 0) default values in (response data)
      month: month,
      income: income,
      expense: expense,
      year: year,
      day: index, // i is the index of the missing days from response
    });
  }
  return history;
}

type HistoryFilteredType = {
  month: number;
  income: number;
  expense: number;
  year: number;
  day?: number;
};

async function getYearHistoryData(userId: string, year: number) {
  const result = await prismaDB.yearHistory.groupBy({
    by: ['month'], //loop through all months in the year
    where: {
      userId: userId,
      year: year,
    },
    _sum: {
      income: true, //sum all income
      expense: true, //sum all expense
    },
    orderBy: {
      month: 'asc',
    },
  });

  if (!result || result.length === 0) {
    return [];
  }

  // [
  //   {
  //     month:0 january
  //     income:400
  //     expense:200
  //     year: 2023
  //     ->  lets add the missing months except the months already exists / the same with days
  //   }
  // ]

  const history: HistoryFilteredType[] = [];
  // Loop through all months to add missing months in our response

  for (let index = 0; index < 12; index++) {
    let expense = 0;
    let income = 0;

    const month = result.find((data) => data.month === index); //find the month in the result
    if (month) {
      expense = month._sum.expense || 0;
      income = month._sum.income || 0;
    }

    history.push({
      //the rest of the months which werent found in (response) will be added with (expense/income = 0) default values in (response data)
      month: index,
      income: income,
      expense: expense,
      year: year,
      day: 0,
    });
  }
  return history;
}
