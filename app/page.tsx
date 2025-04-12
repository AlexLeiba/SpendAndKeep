import { Button } from '@/components/ui/button';
import { SignOutButton, UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await currentUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className=' min-h-screen max-w-2xl mx-auto px-4'>
      <h2 className='text-center text-2xl'>Landing page</h2>
      <p>Welcome on Spend and Keep app</p>
      <p>This app helps you to keep track of your expenses and incomes</p>
      <Link href={'/sign-in'}>
        <Button>Sign in</Button>
      </Link>
      <Link href={'/sign-up'}>
        <Button>Sign up</Button>
      </Link>
    </div>
  );
}
