'use client';
import { TransactionDialog } from '@/components/TransactionDialog';
import { Button } from '@/components/ui/button';
import { Spacer } from '@/components/ui/spacer';
import { useUser } from '@clerk/nextjs';
import { User } from '@clerk/nextjs/server';
import React from 'react';

export function HelloTopSection() {
  const { user } = useUser();
  return (
    <div className='w-full border-b  '>
      <Spacer size={6} />
      <div className='flex justify-between'>
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
              <Button className='cursor-pointer bg-green-900 hover:bg-green-950 text-white'>
                New income 🤑
              </Button>
            }
          />

          <TransactionDialog
            transactionType='expense'
            triggerChildren={
              <Button className='cursor-pointer bg-red-900 hover:bg-red-950 text-white'>
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
