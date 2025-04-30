'use client';

import React from 'react';
import { TransactionDialog } from './TransactionDialog';
import { Button } from '@/components/ui/button';
import { Spacer } from '@/components/ui/spacer';
import { useUser } from '@clerk/nextjs';

export function HelloTopSection() {
  const { user } = useUser();
  return (
    <div className='w-full border-b  '>
      <Spacer lg={6} md={6} size={3} />
      <div className='flex justify-between lg:flex-row md:flex-row flex-col gap-2'>
        <p className=' text-3xl font-bold'>
          Hello,{' '}
          {user?.firstName
            ? user.firstName
            : user?.username
            ? user.username
            : ''}
          ! 👋
        </p>

        <div className='flex gap-4'>
          <TransactionDialog
            transactionType='income'
            triggerChildren={
              <Button className='cursor-pointer dark:bg-green-900 bg-green-300 hover:bg-green-200 dark:hover:bg-green-800 dark:text-white text-black'>
                New income 🤑
              </Button>
            }
          />

          <TransactionDialog
            transactionType='expense'
            triggerChildren={
              <Button className='cursor-pointer dark:bg-red-900 bg-red-300 hover:bg-red-200 dark:hover:bg-red-800 dark:text-white text-black'>
                New expense 😠
              </Button>
            }
          />
        </div>
      </div>
      <Spacer size={6} />
    </div>
  );
}
