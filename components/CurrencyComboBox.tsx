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
import { useMutation, useQuery } from '@tanstack/react-query';
import { SkeletonWrapper } from './Skeletons/SkeletonWrapper';
import { UserSettings } from '@prisma/client';
import { UpdateUserCurrency } from '@/app/actions/wizard-actions';
import { toast } from 'sonner';

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

  const mutationObj = useMutation({
    mutationFn: UpdateUserCurrency,
    onSuccess: () => {
      toast.success('Currency saved successfully 🎉', {
        id: 'saving-currency',
      });
    },
    onError: () => {
      toast.error('Something went wrong 🥺, please try again', {
        id: 'saving-currency',
      });
    },
  });

  //to avoid recalculation of this fn at every render will save it in a useCallBack , to calculate it only when using
  const handleSelectOption = React.useCallback(
    (currency: CurrencyType | null) => {
      if (!currency) {
        toast.error('Please select a currency');
        return;
      }
      if (currency) {
        toast.loading('Saving currency...', {
          id: 'saving-currency',
        });
        setSelectedCurrency(currency);
        mutationObj.mutate(currency.id);
      }
      setOpen(false);
    },
    [mutationObj]
  );

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className='w-full justify-start'
              disabled={mutationObj.isPending}
            >
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
              setSelectedCurrency={handleSelectOption}
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
          <Button
            variant='outline'
            className='w-[150px] justify-start'
            disabled={mutationObj.isPending}
          >
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
              setSelectedCurrency={handleSelectOption}
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
