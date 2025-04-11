import { prismaDB } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export async function GET(req: Request) {
  // send type parameter at req
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const { searchParams } = new URL(req.url);

  const categoryType = searchParams.get('category');

  const dataValidator = z.enum(['expense', 'income']).nullable();

  const queryParams = dataValidator.safeParse(categoryType);

  if (!queryParams.success) {
    return Response.json(queryParams.error, {
      status: 400,
    });
  }

  const type = queryParams.data;

  const categoriesData = await prismaDB.category.findMany({
    where: {
      userId: user.id,
      ...(type && { type }), // type is optional/ include it only if its defined
    },
    orderBy: {
      name: 'asc',
    },
  });

  return Response.json(categoriesData);
}
