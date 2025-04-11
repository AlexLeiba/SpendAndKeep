'use client';
import { CreateCategorySchema } from '@/consts/schema';
import { TransactionType } from '@/consts/types';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Form, useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { CircleOff, PlusSquare } from 'lucide-react';
import { FormDescription, FormField, FormItem, FormLabel } from './ui/form';
import { Input } from './ui/input';
import { Spacer } from './ui/spacer';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import EmojiPicker from '@emoji-mart/react';
import EmojiData from '@emoji-mart/data';

export function CreateCategoryDialog({ type }: { type: TransactionType }) {
  const [open, setOpen] = React.useState(false);
  const formMethods = useForm({
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
        <DialogHeader>
          <DialogTitle className='flex gap-2'>
            Create new{' '}
            <span
              className={cn(
                'font-medium mr-1 ',
                type === 'income' ? 'text-green-700' : 'text-pink-800',
                'font-medium '
              )}
            >
              {type}
            </span>{' '}
            category
          </DialogTitle>
          <DialogDescription>
            Categories are used to group your transactions
          </DialogDescription>
          <Spacer size={3} />
        </DialogHeader>

        {/* FORM */}
        <Form {...formMethods}>
          <form onChange={(e) => e.preventDefault()}>
            <FormField //FormField === Controller
              control={formMethods.control}
              name='name'
              render={({ field }) => {
                return (
                  <FormItem>
                    {/* p  */}
                    <FormLabel>Name</FormLabel>

                    {/* <FormControl> */}
                    <Input {...field} placeholder='category name' />
                    {/* </FormControl> */}

                    <FormDescription>Your category name</FormDescription>
                  </FormItem>
                );
              }}
            />

            <Spacer size={6} />
            <FormField //FormField === Controller
              control={formMethods.control}
              name='icon'
              render={({ field }) => {
                return (
                  <FormItem>
                    {/* p  */}
                    <FormLabel>Icon</FormLabel>

                    {/* <FormControl> */}
                    {/* <Input {...field} placeholder='category name' /> */}
                    <Popover>
                      <PopoverTrigger asChild className='h-[100px]'>
                        <Button
                          variant='outline'
                          className='w-[200px] flex justify-center cursor-pointer'
                        >
                          {formMethods.watch('icon') ? (
                            <div className='flex flex-col items-center justify-center gap-2'>
                              <p className='text-5xl' role='img'>
                                {formMethods.watch('icon')}
                              </p>
                            </div>
                          ) : (
                            <div className='flex flex-col items-center justify-center gap-2'>
                              <CircleOff size={60} className='size-12' />
                              <p>Select an icon</p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className='w-[200px] p-0'>
                        <EmojiPicker
                          data={EmojiData}
                          onEmojiSelect={(emoji: any) => {
                            formMethods.setValue('icon', emoji.native);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    {/* </FormControl> */}

                    <FormDescription>
                      This is how your category will appear in the app
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
