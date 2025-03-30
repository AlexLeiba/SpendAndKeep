import { Logo } from '@/components/Logo';
import { Spacer } from '@/components/ui/spacer';
import { SignIn } from '@clerk/nextjs';
import React from 'react';

function SignInPage() {
  return (
    <>
      <Logo />
      <Spacer size={6} />
      <SignIn />
    </>
  );
}

export default SignInPage;
