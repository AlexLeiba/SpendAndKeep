'use server';

import {
  CreateCategorySchema,
  CreateCategorySchemaType,
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
