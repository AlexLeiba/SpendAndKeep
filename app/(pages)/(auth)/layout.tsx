import { Spacer } from '@/components/ui/spacer';
import React from 'react';

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='relative flex h-screen w-full flex-col items-center justify-center max-w-5xl mx-auto'>
      <Spacer size={12} md={6} sm={6} />
      <div>{children}</div>
    </div>
  );
}

export default AuthLayout;
