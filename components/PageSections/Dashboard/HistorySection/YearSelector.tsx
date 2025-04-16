import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select';
import { SelectTrigger } from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';
import React from 'react';

type Props = {
  years: number[] | undefined;
  period: {
    month: number;
    year: number;
  };
  setPeriod: React.Dispatch<
    React.SetStateAction<{
      month: number;
      year: number;
    }>
  >;
};
export function YearSelector({ years, period, setPeriod }: Props) {
  console.log('🚀 ~ YearSelector ~ period:', period);
  return (
    <Select
      value={period.year.toString()}
      onValueChange={(value) => setPeriod({ ...period, year: Number(value) })}
    >
      <SelectTrigger>
        <Button variant={'outline'} className='w-[150px] justify-between'>
          {period.year} <ChevronDown />
        </Button>
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          {years?.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
