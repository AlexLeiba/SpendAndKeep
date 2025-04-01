import { CurrencyComboBox } from '@/components/CurrencyComboBox';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Spacer } from '@/components/ui/spacer';
import { SignOutButton, UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-next');
  }

  return (
    <div className='flex items-center justify-center min-h-screen p-8    text-center max-w-5xl mx-auto'>
      <div className='w-full'>
        <h2 className='text-4xl'>
          Welcome <span className='ml-2 font-bold'>{user.firstName} 👋 </span>
        </h2>
        <Spacer size={6} />

        <h3 className='text-2xl text-gray-300'>
          Let's get started by setting up your currency
        </h3>
        <Spacer size={3} />
        <h4 className='text-1xl text-gray-300'>
          You can change these settings at any time
        </h4>
        <Spacer size={6} />
        <Separator className='w-full' />
        <Spacer size={6} />
        <Card className='w-full text-left'>
          <CardHeader>
            <CardTitle>Currency</CardTitle>

            <CardDescription>
              Set your default currency for transactions
            </CardDescription>
          </CardHeader>

          <CardContent>
            {' '}
            <CurrencyComboBox />
          </CardContent>
        </Card>
        <Spacer size={6} />
        <Separator />
        <Spacer size={6} />

        <Button size={'lg'} className='w-full'>
          <Link href={'/dashboard'}>Continue on dashboard</Link>
        </Button>
        <Spacer size={6} />
        <Logo />
      </div>
    </div>
  );
}
