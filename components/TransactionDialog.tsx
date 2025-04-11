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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from './ui/form';
import { Input } from './ui/input';
import { Spacer } from './ui/spacer';
import CategoryPicker from './CategoryPicker';

type Props = {
  transactionType: TransactionType;
  triggerChildren: React.ReactNode;
};

export function TransactionDialog({ transactionType, triggerChildren }: Props) {
  const formMethods = useForm<CreateTransactionSchemaType>({
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
                'font-medium mr-1 ',
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
          <Spacer size={3} />
        </DialogHeader>

        {/* //Form === FormProvider */}
        <Form {...formMethods}>
          <form onChange={(e) => e.preventDefault()}>
            <FormField //FormField === Controller
              control={formMethods.control}
              name='description'
              render={({ field }) => {
                return (
                  <FormItem>
                    {/* p  */}
                    <FormLabel>Description</FormLabel>

                    {/* <FormControl> */}
                    <Input {...field} placeholder='Description' />
                    {/* </FormControl> */}

                    {/* p */}
                    <FormDescription>
                      Transaction description (optional)
                    </FormDescription>
                  </FormItem>
                );
              }}
            />
            <Spacer size={6} />
            <FormField
              control={formMethods.control}
              name='amount'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>

                    {/* <FormControl> */}
                    <Input {...field} placeholder='Amount' />
                    {/* </FormControl> */}

                    <FormDescription>
                      Transaction amount (required)
                    </FormDescription>
                  </FormItem>
                );
              }}
            />
            <Spacer size={6} />
            <FormField
              control={formMethods.control}
              name='category'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Category</FormLabel>

                    {/* <FormControl> */}
                    {/* <Input {...field} placeholder='Category' /> */}
                    <CategoryPicker type={transactionType} />
                    {/* </FormControl> */}

                    <FormDescription>
                      Select a category for this transaction
                    </FormDescription>
                  </FormItem>
                );
              }}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
