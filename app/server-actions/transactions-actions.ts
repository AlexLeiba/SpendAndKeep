'use server';

import { prismaDB } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function DeleteTransactions(transactionId: string) {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const transaction = await prismaDB.transaction.delete({
    where: {
      id: transactionId,
      userId: user.id,
    },
  });

  return transaction;
}
