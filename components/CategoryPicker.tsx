'use client';
import { TransactionType } from '@/consts/types';
import { Category } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Command, CommandInput } from './ui/command';
import { CreateCategoryDialog } from './CreateCategoryDialog';

type Props = {
  type: TransactionType;
};
function CategoryPicker({ type }: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  const categoriesQuery = useQuery({
    queryKey: ['categories', type], // if we put query param here after key, IF the parameter will change the query gets refetched auto.
    queryFn: async () => {
      const response = await fetch(`/api/categories?category=${type}`);
      return response.json();
    },
  });

  function handleSelectOption(value: string) {
    setValue(value);
    setOpen(false);
  }

  const selectedCategory = categoriesQuery.data?.find(
    (category: Category) => category.name === value
  );

  // const selectedCategory
  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* TRIGGER */}
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          role='combobox'
          aria-expanded={open}
          className='w-[200px] justify-between'
        >
          {selectedCategory ? (
            <CategoryRow category={selectedCategory} />
          ) : (
            'Select category'
          )}
        </Button>
      </PopoverTrigger>

      {/* CONTENT */}
      <PopoverContent className='w-[200px] p-0'>
        <Command onSubmit={(e) => e.preventDefault()}>
          <CommandInput placeholder='Search category...' />

          {/* CREATE NEW CATEGORY DIALOG (MODAL) */}
          <CreateCategoryDialog type={type} />
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default CategoryPicker;

function CategoryRow({ category }: { category: Category }) {
  return (
    <div className='flex items-center gap-2'>
      <span role='img'>{category.icon}</span>
      <span>{category.name}</span>
    </div>
  );
}
