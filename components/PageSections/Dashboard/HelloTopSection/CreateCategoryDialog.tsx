'use client';
import React from 'react';
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from '@/consts/schema';
import { TransactionType } from '@/consts/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormProvider, useForm } from 'react-hook-form';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../ui/dialog';
import { Button } from '../../../ui/button';
import { CircleOff, Loader, PlusSquare } from 'lucide-react';
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '../../../ui/form';
import { Input } from '../../../ui/input';
import { Spacer } from '../../../ui/spacer';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../../../ui/popover';
import EmojiPicker from '@emoji-mart/react';
import EmojiData from '@emoji-mart/data';
import { createCategory } from '@/app/server-actions/dashboard-actions';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Category } from '@prisma/client';

export function CreateCategoryDialog({
  type,
  handleSuccessCreatedCategory,
  refetchCategoriesList,
}: {
  type: TransactionType;
  handleSuccessCreatedCategory?: (category: Category) => void;
  refetchCategoriesList?: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const formMethods = useForm({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: '',
      icon: '',
      type: type,
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = formMethods;

  //QUERY MUTATION
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createCategory,
    onSuccess: async (data: Category) => {
      toast.success(`Category ${data.name} created successfully 🎉`, {
        id: 'create-category',
      });
      handleSuccessCreatedCategory?.(data);
      reset();
      setOpen(false);

      refetchCategoriesList?.();

      // to refetch the categories query
      await queryClient.invalidateQueries({
        queryKey: ['categories'],
      });
    },
    onError: () => {
      toast.error('Something went wrong 🥺, please try again', {
        id: 'create-category',
      });
    },
  });

  const handleAddNewIncomeCategory = React.useCallback(
    async (formData: CreateCategorySchemaType) => {
      toast.loading('Creating new category...', {
        id: 'create-category',
      });

      mutate(formData);
    },
    [mutate]
  );

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
        <FormProvider {...formMethods}>
          <Form>
            <FormField //FormField === Controller
              control={control}
              name='name'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>

                    <Input {...field} placeholder='category name' />
                    <p className='text-xs text-red-500'>
                      {errors.name?.message}
                    </p>

                    <FormDescription>Your category name</FormDescription>
                  </FormItem>
                );
              }}
            />

            <Spacer size={6} />
            <FormField //FormField === Controller
              control={control}
              name='icon'
              render={({ field }) => {
                return (
                  <FormItem>
                    {/* ADD ICON DROPDOWN */}
                    <FormLabel>Icon</FormLabel>

                    <Popover>
                      {/* TRIGGER */}
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

                      {/* CONTENT */}
                      <PopoverContent className='w-[200px] p-0'>
                        <EmojiPicker
                          data={EmojiData}
                          onEmojiSelect={(emoji: any) => {
                            formMethods.setValue('icon', emoji.native);
                          }}
                        />
                      </PopoverContent>
                      <p className='text-xs text-red-500'>
                        {errors.icon?.message}
                      </p>
                      <FormDescription>
                        This is how your category will appear in the app
                      </FormDescription>

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
                              onClick={handleSubmit(handleAddNewIncomeCategory)}
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
                    </Popover>
                  </FormItem>
                );
              }}
            />
          </Form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
