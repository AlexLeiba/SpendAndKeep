'use client';
import { TransactionType } from '@/consts/types';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import {
  CreateTransactionSchema,
  type CreateTransactionSchemaType,
} from '@/consts/schema';
import { zodResolver } from '@hookform/resolvers/zod';

type Props = {
  transactionType: TransactionType;
  triggerChildren: React.ReactNode;
};

export function TransactionDialog({ transactionType, triggerChildren }: Props) {
  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      amount: 0,
      category: '',
      date: new Date(),
      description: '',
      type: transactionType,
    },
  });
  return (
    <Dialog>
      <DialogTrigger asChild={true}>{triggerChildren}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create a new{' '}
            <span
              className={cn(
                'font-medium mr-1',
                transactionType === 'income'
                  ? 'text-green-700'
                  : 'text-pink-800',
                'font-medium '
              )}
            >
              {transactionType}
            </span>
            transaction
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
