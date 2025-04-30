import { Wallet } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export function Logo() {
  return (
    <div className='flex items-center justify-center gap-4 '>
      <Link href='/dashboard' className='cursor-pointer'>
        <div className='flex items-center gap-1'>
          <Wallet className='w-6 h-6 stroke stroke-amber-500' />
          <p className='text-2xl font-bold bg-gradient-to-r from-amber-500 to-green-600 bg-clip-text text-transparent'>
            Spend&Keep
          </p>
        </div>
      </Link>
    </div>
  );
}
