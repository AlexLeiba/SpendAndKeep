'use server';

import { prismaDB } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function RemoveCategoryAction({
  categoryId,
  categoryType,
}: {
  categoryId: string;
  categoryType: 'expense' | 'income';
}) {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const category = await prismaDB.category.delete({
    where: {
      id: categoryId,
      userId: user.id,
      type: categoryType,
    },
  });

  return category;
}
