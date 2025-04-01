'use client';

import * as React from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Currencies, type CurrencyType } from '@/lib/currencies';
import { useQuery } from '@tanstack/react-query';
import { SkeletonWrapper } from './Skeletons/SkeletonWrapper';
import { UserSettings } from '@prisma/client';
import { set } from 'date-fns';

export function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [selectedCurrency, setSelectedCurrency] =
    React.useState<CurrencyType | null>(null);

  const { data: userSettings, isFetching } = useQuery<UserSettings>({
    queryKey: ['userSettings'],
    queryFn: () => fetch('/api/user-settings').then((res) => res.json()),
  });

  React.useEffect(() => {
    if (!userSettings) {
      setSelectedCurrency(null);
    }
    const userCurrency = Currencies.find(
      (currency) => currency.id === userSettings?.currency
    );

    if (userCurrency) {
      setSelectedCurrency(userCurrency);
    }
  }, [userSettings]);

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant='outline' className='w-full justify-start'>
              {selectedCurrency ? (
                <>
                  <span className='font-bold'>{selectedCurrency.symbol}</span> |{' '}
                  {selectedCurrency.name}
                </>
              ) : (
                <>+ Set currency</>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[200px] p-0' align='start'>
            <StatusList
              setOpen={setOpen}
              setSelectedCurrency={setSelectedCurrency}
            />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    );
  }

  return (
    <SkeletonWrapper isLoading={isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant='outline' className='w-[150px] justify-start'>
            {selectedCurrency ? (
              <>
                <span className='font-bold'>{selectedCurrency.symbol}</span> |{' '}
                {selectedCurrency.name}
              </>
            ) : (
              <>+ Set currency</>
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className='mt-4 border-t'>
            <StatusList
              setOpen={setOpen}
              setSelectedCurrency={setSelectedCurrency}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  );
}

function StatusList({
  setOpen,
  setSelectedCurrency,
}: {
  setOpen: (open: boolean) => void;
  setSelectedCurrency: (currency: CurrencyType | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder='Filter currency...' />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Currencies.map((currencyData) => (
            <CommandItem
              key={currencyData.id}
              value={currencyData.name}
              onSelect={(value) => {
                setSelectedCurrency(
                  Currencies.find((priority) => priority.name === value) || null
                );
                setOpen(false);
              }}
            >
              <span className='font-bold'>{currencyData.symbol}</span> |{' '}
              {currencyData.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
