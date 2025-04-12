'use client';
import { TransactionType } from '@/consts/types';
import { Category } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { CreateCategoryDialog } from './CreateCategoryDialog';
import { CommandEmpty } from 'cmdk';
import { Check, ChevronsUpDown } from 'lucide-react';

type Props = {
  type: TransactionType;
};
function CategoryPicker({ type }: Props) {
  const [open, setOpen] = React.useState(false);
  const [selectedCat, setSelectedCat] = React.useState<string>('');

  const categoriesQuery = useQuery({
    queryKey: ['categories', type], // if we put query param here after key, IF the parameter will change the query gets refetched auto.
    queryFn: async () => {
      const response = await fetch(`/api/categories?category=${type}`);
      return response.json();
    },
  });

  function handleSelectOption(value: string) {
    setSelectedCat(value);
    setOpen(false);
  }

  const selectedCategory = categoriesQuery.data?.find(
    (category: Category) => category.name === selectedCat
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
          <ChevronsUpDown />
        </Button>
      </PopoverTrigger>

      {/* CONTENT */}
      <PopoverContent className='w-[200px] p-0'>
        <Command onSubmit={(e) => e.preventDefault()}>
          <CommandInput placeholder='Search category...' />

          <CommandGroup>
            <CommandList>
              {categoriesQuery?.data?.length > 0 &&
                categoriesQuery?.data.map(
                  (category: Category, index: number) => (
                    <CommandItem
                      key={index}
                      value={category.name}
                      onSelect={(value) => {
                        handleSelectOption(value);
                      }}
                    >
                      <CategoryRow
                        category={category}
                        selectedCat={selectedCat}
                      />
                    </CommandItem>
                  )
                )}
            </CommandList>
            <CommandEmpty className='text-xs m-2'>
              No categories found
            </CommandEmpty>
          </CommandGroup>

          {/* CREATE NEW CATEGORY DIALOG (MODAL) */}
          <CreateCategoryDialog type={type} />
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default CategoryPicker;

function CategoryRow({
  category,
  selectedCat,
}: {
  category: Category;
  selectedCat?: string;
}) {
  return (
    <div className='flex items-center justify-between w-full'>
      <div className='flex gap-2'>
        <span role='img'>{category.icon}</span>
        <span>{category.name}</span>
      </div>
      {selectedCat === category.name && <Check />}
    </div>
  );
}
