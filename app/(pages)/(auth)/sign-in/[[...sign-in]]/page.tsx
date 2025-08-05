import { Logo } from '@/components/Logo';
import { Spacer } from '@/components/ui/spacer';
import { SignIn } from '@clerk/nextjs';
import React from 'react';

function SignInPage() {
  return (
    <div className='h-[calc(100vh-65px)] '>
      <div className='flex flex-col items-center justify-center min-h-[600px] h-full'>
        <SignIn />
      </div>
    </div>
  );
}

export default SignInPage;
