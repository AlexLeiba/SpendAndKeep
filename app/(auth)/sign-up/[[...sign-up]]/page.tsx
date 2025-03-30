import { Logo } from '@/components/Logo';
import { Spacer } from '@/components/ui/spacer';
import { SignUp } from '@clerk/nextjs';
import React from 'react';

function SignUpPage() {
  return (
    <>
      <Logo />
      <Spacer size={6} />
      <SignUp />
    </>
  );
}

export default SignUpPage;
