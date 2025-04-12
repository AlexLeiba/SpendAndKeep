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

  return await prismaDB.transaction.create({
    data: {
      userId: user.id,
      description: description ?? '',
      amount: amount,
      category: category,
      type: type,
      date: date ? date : new Date(), // Add a default date or use a value from transactionData if available
      categoryIcon: categoryIcon ?? '',
    },
  });
}
