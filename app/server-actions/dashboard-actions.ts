'use server';

import {
  CreateCategorySchema,
  CreateCategorySchemaType,
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from '@/consts/schema';
import { prismaDB } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function createCategory(categoryData: CreateCategorySchemaType) {
  console.log('🚀 ~ createCategory ~ categoryData:\n\n\n\n\n', categoryData);
  const parsedBody = CreateCategorySchema.safeParse(categoryData);

  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const { name, icon, type } = parsedBody.data;

  return await prismaDB.category.create({
    data: {
      userId: user.id,
      name: name,
      icon: icon,
      type: type,
    },
  });
}

export async function createTransaction(
  transactionData: CreateTransactionSchemaType
) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const parsedBody = CreateTransactionSchema.safeParse(transactionData);

  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const { amount, category, description, type, categoryIcon, date } =
    parsedBody.data;

  await prismaDB.$transaction([
    prismaDB.transaction.create({
      data: {
        userId: user.id,
        description: description ?? '',
        amount: amount,
        category: category,
        type: type,
        date: date ? date : new Date(), // Add a default date or use a value from transactionData if available
        categoryIcon: categoryIcon ?? '',
      },
    }),

    prismaDB.monthHistory.upsert({
      where: {
        //in Prisma schema (userId_day_month_year) this is the structure which creates the ID in this format
        userId_day_month_year: {
          // If The date has the same (day,month and yeat)  it will be the same ID -> so it only will be UPDATED / otherwise it will be CREATED
          userId: user.id,
          month: date?.getMonth() || currentMonth,
          day: date?.getDate() || currentDay,
          year: date?.getFullYear() || currentYear,
        },
      },
      create: {
        userId: user.id,
        month: date?.getMonth() || currentMonth,
        day: date?.getDate() || currentDay,
        year: date?.getFullYear() || currentYear,
        expense: type === 'expense' ? amount : 0,
        income: type === 'income' ? amount : 0,
      },
      update: {
        expense: {
          increment: type === 'expense' ? amount : 0,
        },
        income: {
          increment: type === 'income' ? amount : 0,
        },
      },
    }),
    prismaDB.yearHistory.upsert({
      where: {
        //in Prisma schema (userId_month_year) this is the structure which creates the unique ID in this format
        // If The date has the same moth and year it will be the same ID -> so it only will be UPDATED / otherwise it will be CREATED
        userId_month_year: {
          //here we gonna search for this id ( if exists (update) else {create)})
          userId: user.id,
          month: date?.getMonth() || currentMonth,
          year: date?.getFullYear() || currentYear,
        },
      },
      create: {
        userId: user.id,
        month: date?.getMonth() || currentMonth,
        year: date?.getFullYear() || currentYear,
        expense: type === 'expense' ? amount : 0,
        income: type === 'income' ? amount : 0,
      },
      update: {
        expense: {
          increment: type === 'expense' ? amount : 0,
        },
        income: {
          increment: type === 'income' ? amount : 0,
        },
      },
    }),
    // update aggregates table
  ]);

  // return await prismaDB.transaction.create({
  //   data: {
  //     userId: user.id,
  //     description: description ?? '',
  //     amount: amount,
  //     category: category,
  //     type: type,
  //     date: date ? date : new Date(), // Add a default date or use a value from transactionData if available
  //     categoryIcon: categoryIcon ?? '',
  //   },
  // });
}
