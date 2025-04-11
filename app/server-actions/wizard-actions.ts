'use server';

import { UserSettingsSchema } from '@/consts/schema';
import { prismaDB } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function UpdateUserCurrency(currency: string) {
  const parsedBody = UserSettingsSchema.safeParse({
    currency,
  });

  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const userSettings = await prismaDB.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  let userSettingsUpdated;
  if (!userSettings) {
    userSettingsUpdated = await prismaDB.userSettings.create({
      data: {
        userId: user.id,
        currency: currency,
      },
    });
  } else {
    userSettingsUpdated = await prismaDB.userSettings.update({
      where: {
        userId: user.id,
      },
      data: {
        currency: currency,
      },
    });
  }

  return userSettingsUpdated;
}
