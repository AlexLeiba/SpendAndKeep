'use client';
import { CreateCategorySchema } from '@/consts/schema';
import { TransactionType } from '@/consts/types';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { PlusSquare } from 'lucide-react';

export function CreateCategoryDialog({ type }: { type: TransactionType }) {
  const [open, setOpen] = React.useState(false);
  const form = useForm({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: '',
      icon: '',
      type: type,
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={'ghost'}
          className='flex border-separate items-center justify-start rounded-none border-b px-3 py-3 text-muted-foreground'
        >
          <PlusSquare className='mr-1 h-4 w-4' />
          Create new category
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={form.handleSubmit(console.log)}>
          <input type='text' name='name' placeholder='Name' />
          <input type='text' name='icon' placeholder='Icon' />
          <button type='submit'>Create</button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
