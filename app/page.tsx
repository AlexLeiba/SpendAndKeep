import { SignOutButton, UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-next');
  }

  return (
    <div className=' min-h-screen '>
      <h2 className='text-center text-2xl'>Landing page</h2>
    </div>
  );
}
