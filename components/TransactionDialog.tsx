'use client';
import React from 'react';
import { TransactionType } from '@/consts/types';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from './ui/form';
import { Input } from './ui/input';
import { Spacer } from './ui/spacer';
import CategoryPicker from './CategoryPicker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTransaction } from '@/app/server-actions/dashboard-actions';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { CalendarIcon, Loader } from 'lucide-react';
import { format } from 'date-fns';
import { Popover } from './ui/popover';
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Calendar } from './ui/calendar';

type Props = {
  transactionType: TransactionType;
  triggerChildren: React.ReactNode;
};

export function TransactionDialog({ transactionType, triggerChildren }: Props) {
  const [open, setOpen] = React.useState(false);
  const [isDatePopoverOpen, setIsDatePopoverOpen] = React.useState(false);

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

  const {
    handleSubmit,
    formState: { errors },
    reset,
  } = formMethods;

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      toast.success('Transaction created successfully 🎉', {
        id: 'create-transaction',
      });

      reset();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['overview-transactions'] }); // refetch transactions overview on Dashboard page
    },
    onError: () => {
      toast.error('Something went wrong 🥺, please try again', {
        id: 'create-transaction',
      });
    },
  });

  const handleCreateANewTransaction = React.useCallback(
    async (formData: CreateTransactionSchemaType) => {
      toast.loading('Creating new transaction...', {
        id: 'create-transaction',
      });

      mutate(formData);
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        {/* DESCRIPTION */}
        <Form {...formMethods}>
          <form onChange={(e) => e.preventDefault()}>
            <FormField //FormField === Controller
              control={formMethods.control}
              name='description'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Description</FormLabel>

                    <Input {...field} placeholder='Description' />
                    <p className='text-xs text-red-500'>
                      {errors?.description?.message}
                    </p>

                    <FormDescription>
                      Transaction description (optional)
                    </FormDescription>
                  </FormItem>
                );
              }}
            />

            {/* AMOUNT */}
            <Spacer size={6} />
            <FormField ////FormField === Controller
              control={formMethods.control}
              name='amount'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>

                    <Input {...field} placeholder='Amount' />
                    <p className='text-xs text-red-500'>
                      {errors.amount?.message}
                    </p>

                    <FormDescription>
                      Transaction amount (required)
                    </FormDescription>
                  </FormItem>
                );
              }}
            />
            <Spacer size={6} />
            <div className='flex justify-between gap-4'>
              {/* CATEGORY */}
              <FormField ////FormField === Controller
                control={formMethods.control}
                name='category'
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Category</FormLabel>

                      <CategoryPicker type={transactionType} />
                      <p className='text-xs text-red-500'>
                        {errors.category?.message}
                      </p>

                      <FormDescription>
                        Select a category for this transaction
                      </FormDescription>
                    </FormItem>
                  );
                }}
              />
              {/* DATE */}
              <FormField ////FormField === Controller
                control={formMethods.control}
                name='date'
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Transaction date</FormLabel>

                      <Popover
                        open={isDatePopoverOpen}
                        onOpenChange={setIsDatePopoverOpen}
                      >
                        {/* TRIGGER */}
                        <PopoverTrigger asChild>
                          <Button
                            type='button'
                            variant={'outline'}
                            className='flex justify-between'
                          >
                            {field.value
                              ? format(field.value, 'PPP')
                              : 'Select a date'}

                            <CalendarIcon />
                          </Button>
                        </PopoverTrigger>

                        <p className='text-xs text-red-500'>
                          {errors.date?.message}
                        </p>

                        <FormDescription>
                          Select a date for this transaction
                        </FormDescription>

                        {/* CONTENT */}
                        <PopoverContent className='w-auto p-0 dark:bg-gray-900 bg-gray-200'>
                          <Calendar
                            mode='single'
                            onSelect={field.onChange}
                            selected={field.value}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  );
                }}
              />
            </div>
          </form>
        </Form>

        {/* FOOTER */}
        <Spacer size={6} />
        <DialogFooter>
          <DialogClose asChild>
            <div className='flex gap-2'>
              <Button type='button' variant='secondary'>
                Cancel
              </Button>
              <Button
                disabled={isPending}
                onClick={handleSubmit(handleCreateANewTransaction)}
              >
                {isPending ? (
                  <div className='flex gap-2'>
                    <span className='animate-spin'>
                      <Loader />
                    </span>
                  </div>
                ) : (
                  'Create'
                )}
              </Button>
            </div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
