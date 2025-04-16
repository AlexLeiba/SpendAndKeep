import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select';
import { MONTHS } from '@/lib/consts';
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

export function MonthSelector({ years, period, setPeriod }: Props) {
  console.log('🚀 ~ YearSelector ~ period:', period);
  return (
    <Select
      value={period.month.toString()}
      onValueChange={(value) => setPeriod({ ...period, month: Number(value) })}
    >
      <SelectTrigger>
        <Button variant={'outline'} className='w-[150px] justify-between'>
          {MONTHS[period.month - 1].name} <ChevronDown />
        </Button>
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          {MONTHS.map((month) => (
            <SelectItem key={month.id} value={(month.id + 1).toString()}>
              {month.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
