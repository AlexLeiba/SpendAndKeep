import { prismaDB } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function GET(req: Request) {
  const user = await currentUser();

  if (!user) {
    return redirect('/sign-in');
  }

  const userSettings = await prismaDB.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (!userSettings) {
    await prismaDB.userSettings.create({
      data: {
        userId: user.id,
        currency: 'EUR', //as default
      },
    });
  }

  revalidatePath('/dashboard'); //to refetch new data in the dashboard after user settings are updated
  return Response.json(userSettings);
}
