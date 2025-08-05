import { Logo } from '@/components/Logo';
import { Spacer } from '@/components/ui/spacer';
import { SignUp } from '@clerk/nextjs';
import React from 'react';

function SignUpPage() {
  return (
    <div className='h-[calc(100vh-65px)] '>
      <div className='flex flex-col items-center justify-center min-h-[700px] h-full'>
        <SignUp />
      </div>
    </div>
  );
}

export default SignUpPage;
